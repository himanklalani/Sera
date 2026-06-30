const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // ADD THIS IMPORT

// Helper to clean and populate cart
const getCleanCart = async (cartId) => {
  let cart = await Cart.findById(cartId).populate('items.product');
  if (!cart) return { cart: null, itemsRemoved: false };

  const initialCount = cart.items.length;
  cart.items = cart.items.filter(item => item.product !== null);
  
  let itemsRemoved = false;
  if (cart.items.length !== initialCount) {
    itemsRemoved = true;
    await cart.save();
    // Re-populate after filtering to ensure consistency
    cart = await Cart.findById(cartId).populate('items.product');
  }

  const cartObj = cart.toObject();
  cartObj.itemsRemoved = itemsRemoved;
  return cartObj;
};

// @desc    Get abandoned carts / cart updates from last 14 days
// @route   GET /api/cart/abandoned
// @access  Private/Admin
router.get('/abandoned', protect, admin, asyncHandler(async (req, res) => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const carts = await Cart.find({ 
    updatedAt: { $gte: fourteenDaysAgo },
    'items.0': { $exists: true } // Only carts with items
  })
  .populate('user', 'name email phone')
  .populate('items.product', 'name price images')
  .sort({ updatedAt: -1 });

  // Filter out carts where user was deleted or not found
  const validCarts = carts.filter(cart => cart.user);
  res.json(validCarts);
}));

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const cleanedCart = await getCleanCart(cart._id);
  res.json(cleanedCart);
}));

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  // ADDED: Validate product exists and check stock
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // ADDED: Check if requested quantity exceeds stock
  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }
  
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product && item.product.toString() === productId);

  if (itemIndex > -1) {
    // MODIFIED: Check if new total quantity exceeds stock
    const newQuantity = cart.items[itemIndex].quantity + Number(quantity);
    
    if (newQuantity > product.stock) {
      res.status(400);
      throw new Error(`Cannot add ${quantity} more. Only ${product.stock - cart.items[itemIndex].quantity} items left in stock`);
    }
    
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  const cleanedCart = await getCleanCart(cart._id);
  res.json(cleanedCart);
}));

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    // MODIFIED: Handle both direct product ID and object with _id (for null product cases)
    cart.items = cart.items.filter(item => {
      const itemProductId = item.product ? item.product.toString() : null;
      return itemProductId !== req.params.productId && item._id.toString() !== req.params.productId;
    });
    
    await cart.save();
    const cleanedCart = await getCleanCart(cart._id);
    res.json(cleanedCart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
}));

// @desc    Update item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', protect, asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  
  // ADDED: Validate product and stock before updating
  const product = await Product.findById(req.params.productId);
  if (!product) {
    // If we're trying to update quantity of a missing product, let cleanup handle it later or fail now
    res.status(404);
    throw new Error('Product not found');
  }
  
  // ADDED: Check if new quantity exceeds stock
  if (quantity > product.stock) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }
  
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex(item => item.product && item.product.toString() === req.params.productId);
    if (itemIndex > -1) {
      // ADDED: Remove item if quantity is 0 or less
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      
      await cart.save();
      const cleanedCart = await getCleanCart(cart._id);
      res.json(cleanedCart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
}));

module.exports = router;
