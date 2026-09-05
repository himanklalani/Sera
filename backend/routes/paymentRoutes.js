const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

async function validateAndCalculateOrder(orderItems, couponCode, userId) {
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error('No order items');
  }

  const physicalStockDemand = {}; 
  const processedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product)
      .populate('comboItems', 'stock name _id');

    if (!product) {
      throw new Error(`Product not found`);
    }

    if (product.isCombo && product.comboItems && product.comboItems.length > 0) {
      for (const comp of product.comboItems) {
        const cId = comp._id.toString();
        physicalStockDemand[cId] = (physicalStockDemand[cId] || 0) + item.quantity;
      }
    } else {
      const pId = product._id.toString();
      physicalStockDemand[pId] = (physicalStockDemand[pId] || 0) + item.quantity;
    }

    processedItems.push({
      ...item,
      productDetails: product
    });
  }

  for (const [productId, totalDemand] of Object.entries(physicalStockDemand)) {
    const stockProduct = await Product.findById(productId).select('name stock');
    if (!stockProduct || stockProduct.stock < totalDemand) {
      throw new Error(
        `Insufficient stock for ${stockProduct?.name || 'a product'}. Your cart requires ${totalDemand} but only ${stockProduct?.stock || 0} available.`
      );
    }
  }

  const cartValue = processedItems.reduce((acc, item) => acc + item.quantity * item.productDetails.price, 0);
  const discountableCartValue = processedItems
    .filter(item => !item.productDetails.isAddon)
    .reduce((acc, item) => acc + item.quantity * item.productDetails.price, 0);
  
  let shippingCost = cartValue > 999 ? 0 : 100;
  let finalTotalPrice = cartValue + shippingCost;
  let couponDiscount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const normalizedCode = couponCode.toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon || !coupon.isActive) {
      throw new Error('Invalid or inactive coupon');
    }

    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now) {
      throw new Error('Coupon has expired');
    }

    if (typeof coupon.usageLimit === 'number' && coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    if (coupon.minOrderValue && discountableCartValue < coupon.minOrderValue) {
      throw new Error(`Minimum order value for this coupon is INR ${coupon.minOrderValue}`);
    }

    if (coupon.allowedUsers && coupon.allowedUsers.length > 0 && !coupon.allowedUsers.some((u) => u.toString() === userId.toString())) {
      throw new Error('This coupon is not valid for your account');
    }

    const userOrderCount = await Order.countDocuments({ user: userId });
    if (coupon.isFirstOrderOnly && userOrderCount > 0) {
      throw new Error('This coupon is only valid on your first order');
    }

    if (coupon.perUserLimit && coupon.perUserLimit > 0) {
      const userCouponUsage = await Order.countDocuments({ user: userId, couponCode: coupon.code });
      if (userCouponUsage >= coupon.perUserLimit) {
        throw new Error('You have already used this coupon the maximum number of times');
      }
    }

    if (coupon.isFreeShipping) {
      shippingCost = 0;
    }

    if (coupon.discountType === 'percentage') {
      couponDiscount = (discountableCartValue * coupon.discountValue) / 100;
    } else {
      couponDiscount = coupon.discountValue;
    }

    if (couponDiscount > discountableCartValue) {
      couponDiscount = discountableCartValue;
    }

    finalTotalPrice = cartValue + shippingCost - couponDiscount;
    appliedCoupon = coupon;
  }

  return { finalTotalPrice, shippingCost, couponDiscount, appliedCoupon, physicalStockDemand, processedItems };
}

router.post(
  '/create-order',
  protect,
  asyncHandler(async (req, res) => {
    const { orderItems, couponCode, currency, receipt } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      res.status(500);
      throw new Error('Razorpay keys are not configured');
    }

    try {
      const { finalTotalPrice } = await validateAndCalculateOrder(orderItems, couponCode, req.user._id);

      const orderPayload = {
        amount: Math.round(finalTotalPrice * 100), // amount in paise
        currency: currency || 'INR',
        receipt: receipt || `rcpt_${Date.now()}_${req.user._id.toString().slice(-6)}`,
      };

      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const { data } = await axios.post(
        'https://api.razorpay.com/v1/orders',
        orderPayload,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.json({
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        receipt: data.receipt,
        keyId,
      });
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

router.post(
  '/verify-payment',
  protect,
  asyncHandler(async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderItems,
      shippingAddress,
      couponCode,
    } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      res.status(500);
      throw new Error('Razorpay key secret is not configured');
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Payment details are incomplete');
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment signature verification failed');
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.phone) {
      res.status(400);
      throw new Error('Complete shipping address is required');
    }

    try {
      const { finalTotalPrice, shippingCost, couponDiscount, appliedCoupon, physicalStockDemand, processedItems } = await validateAndCalculateOrder(orderItems, couponCode, req.user._id);

      // Atomic stock deduction
      const successfulDeductions = [];
      try {
        for (const [productId, totalDemand] of Object.entries(physicalStockDemand)) {
          const updated = await Product.findOneAndUpdate(
            { _id: productId, stock: { $gte: totalDemand } },
            { $inc: { stock: -totalDemand, sales: totalDemand } },
            { new: true }
          );

          if (!updated) {
            for (const { id, qty } of successfulDeductions) {
              await Product.findByIdAndUpdate(id, { $inc: { stock: qty, sales: -qty } });
            }
            throw new Error('Stock changed during checkout. Please review your cart and try again.');
          }
          successfulDeductions.push({ id: productId, qty: totalDemand });
        }
      } catch (err) {
        throw err;
      }

      // Increment coupon usage
      if (appliedCoupon) {
        const updatedCoupon = await Coupon.findOneAndUpdate(
          {
            _id: appliedCoupon._id,
            ...(typeof appliedCoupon.usageLimit === 'number' && appliedCoupon.usageLimit > 0
              ? { usageCount: { $lt: appliedCoupon.usageLimit } }
              : {})
          },
          { $inc: { usageCount: 1 } },
          { new: true }
        );
        if (!updatedCoupon) {
           for (const { id, qty } of successfulDeductions) {
              await Product.findByIdAndUpdate(id, { $inc: { stock: qty, sales: -qty } });
           }
           throw new Error('Coupon was just used by another order. Please try again without the coupon.');
        }
      }

      const order = new Order({
        user: req.user._id,
        items: processedItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.productDetails.price,
          size: item.size,
          name: item.productDetails?.name,
          note: item.note || undefined,
          comboItems: (item.productDetails?.isCombo && item.productDetails?.comboItems?.length > 0)
            ? item.productDetails.comboItems.map(c => c._id)
            : []
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India',
          phone: shippingAddress.phone,
          landmark: shippingAddress.landmark || '',
        },
        totalPrice: finalTotalPrice,
        shippingPrice: shippingCost,
        status: 'pending',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        invoiceNumber: `INV-${Date.now()}`,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        couponDiscount: couponDiscount || 0,
      });

      const createdOrder = await order.save();

      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [] }
      );

      res.json({
        success: true,
        order: createdOrder,
      });
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

module.exports = router;
