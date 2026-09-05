const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // ADD THIS IMPORT

// Helper to clean and populate cart
const getCleanCart = async (cartId) => {
  let cart = await Cart.findById(cartId).populate({
    path: 'items.product',
    populate: { path: 'comboItems', select: 'stock' }
  });
  if (!cart) return { cart: null, itemsRemoved: false, stockAdjusted: false };

  let itemsRemoved = false;
  let stockAdjusted = false;

  const validItems = [];

  for (const item of cart.items) {
    if (item.product !== null) {
      validItems.push(item);
    } else {
      // Product deleted from DB entirely
      itemsRemoved = true;
    }
  }

  if (itemsRemoved) {
    cart.items = validItems;
    await cart.save();
    // Re-populate after filtering to ensure consistency
    cart = await Cart.findById(cartId).populate({
      path: 'items.product',
      populate: { path: 'comboItems', select: 'stock' }
    });
  }

  // Convert to plain object FIRST, then mutate virtual stock safely
  const cartObj = cart.toObject();
  cartObj.itemsRemoved = itemsRemoved;
  cartObj.stockAdjusted = stockAdjusted;

  // Apply virtual stock calculation on plain object
  for (const item of cartObj.items) {
    if (item.product && item.product.isCombo && item.product.comboItems && item.product.comboItems.length > 0) {
      item.product.stock = Math.min(...item.product.comboItems.map(i => i?.stock || 0));
    }
  }

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
  const { productId, quantity, size, note } = req.body;
  
  const product = await Product.findById(productId).populate('comboItems', 'stock');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (product.isCombo && product.comboItems && product.comboItems.length > 0) {
    product.stock = Math.min(...product.comboItems.map(i => i.stock || 0));
  }
  
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = note
    ? -1
    : cart.items.findIndex(item => 
        item.product &&
        item.product.toString() === productId &&
        (item.size || '') === (size || '')
      );

  let addedQuantity = Number(quantity);
  let warning = null;

  if (itemIndex > -1) {
    let newQuantity = cart.items[itemIndex].quantity + addedQuantity;
    if (newQuantity > product.stock && product.price > 0) {
      if (cart.items[itemIndex].quantity >= product.stock) {
        res.status(400);
        throw new Error(`You already have the maximum available stock (${product.stock}) in your cart.`);
      }
      newQuantity = product.stock;
      warning = `Quantity capped to maximum available stock (${product.stock}).`;
    }
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    if (addedQuantity > product.stock && product.price > 0) {
      if (product.stock <= 0) {
        res.status(400);
        throw new Error(`Item is out of stock`);
      }
      addedQuantity = product.stock;
      warning = `Only ${product.stock} items available. Quantity adjusted.`;
    }
    
    cart.items.push({ 
      product: productId, 
      quantity: addedQuantity, 
      size: size || undefined,
      note: note ? note.substring(0, 450) : undefined
    });
  }

  await cart.save();
  const cleanedCart = await getCleanCart(cart._id);
  res.json({ ...cleanedCart, warning });
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
  const product = await Product.findById(req.params.productId).populate('comboItems', 'stock');
  if (!product) {
    // If we're trying to update quantity of a missing product, let cleanup handle it later or fail now
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (product.isCombo && product.comboItems && product.comboItems.length > 0) {
    product.stock = Math.min(...product.comboItems.map(i => i.stock || 0));
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


// @desc    Sync guest cart
// @route   POST /api/cart/sync
// @access  Private
router.post('/sync', protect, asyncHandler(async (req, res) => {
  const { items } = req.body;
  
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  if (items && Array.isArray(items)) {
    for (const item of items) {
      if (!item.productId) continue;
      
      const product = await Product.findById(item.productId).populate('comboItems', 'stock');
      if (!product) continue;
      
      if (product.isCombo && product.comboItems && product.comboItems.length > 0) {
        product.stock = Math.min(...product.comboItems.map(i => i.stock || 0));
      }
      
      const itemIndex = item.note
        ? -1
        : cart.items.findIndex(cartItem => 
            cartItem.product &&
            cartItem.product.toString() === item.productId &&
            (cartItem.size || '') === (item.size || '')
          );

      let addedQuantity = Number(item.quantity);

      if (itemIndex > -1) {
        let newQuantity = cart.items[itemIndex].quantity + addedQuantity;
        if (newQuantity > product.stock && product.price > 0) {
          newQuantity = product.stock;
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        if (addedQuantity > product.stock && product.price > 0) {
          addedQuantity = product.stock;
        }
        
        cart.items.push({ 
          product: item.productId, 
          quantity: addedQuantity, 
          size: item.size || undefined,
          note: item.note ? item.note.substring(0, 450) : undefined
        });
      }
    }
    await cart.save();
  }

  const cleanedCart = await getCleanCart(cart._id);
  res.json(cleanedCart);
}));

module.exports = router;
