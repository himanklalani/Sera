const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(cart);
}));

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  // Populate to return full product details immediately
  cart = await cart.populate('items.product');
  res.json(cart);
}));

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
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
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = Number(quantity);
            await cart.save();
            cart = await cart.populate('items.product');
            res.json(cart);
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
