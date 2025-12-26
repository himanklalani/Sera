const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      items: orderItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      totalPrice,
      status: 'pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}));

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');

  if (order) {
    // Check if admin or order owner
    if (req.user.role === 'admin' || order.user._id.equals(req.user._id)) {
        res.json(order);
    } else {
        res.status(401);
        throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all/admin
// @access  Private/Admin
router.get('/all/admin', protect, asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
    const orders = await Order.find({})
        .populate('user', 'id name email')
        .populate('items.product')
        .sort({ createdAt: -1 });
    res.json(orders);
}));

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

module.exports = router;
