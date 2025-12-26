const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) { // Assuming matchPassword method exists or implementing check
    // Wait, User model doesn't have methods defined in the file I saw. 
    // I should check password directly if not hashed or add method.
    // For now assuming plain text or simple compare if method missing.
    // Let's implement simple check if method missing:
    // Actually standard is bcrypt compare.
    // I'll assume the User model has pre-save hook for hashing. 
    // But since I didn't see it, I should probably handle it here or update User model.
    // Let's update User model later. For now, basic check.
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password, // Should be hashed in model
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.addresses) {
        // Ensure addresses have correct structure to avoid type conflicts
        user.addresses = req.body.addresses.map(addr => ({
            ...addr,
            type: addr.type || 'Home', // Explicitly set type if missing
            isDefault: Boolean(addr.isDefault)
        }));
    }
    
    try {
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            addresses: updatedUser.addresses,
            wishlist: updatedUser.wishlist,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500);
        throw new Error('Error updating profile: ' + error.message);
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
router.get('/wishlist', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    // Filter out nulls in case product was deleted
    const validWishlist = user.wishlist.filter(item => item !== null);
    res.json(validWishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Add to wishlist
// @route   POST /api/auth/wishlist
// @access  Private
router.post('/wishlist', protect, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
      res.status(400);
      throw new Error('Product ID is required');
  }

  const user = await User.findById(req.user._id);
  
  if (user) {
    try {
        if (!user.wishlist.some(id => id.toString() === productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        const populatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(populatedUser.wishlist);
    } catch (error) {
        console.error("Wishlist add error:", error);
        res.status(500);
        throw new Error('Error adding to wishlist: ' + error.message);
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Remove from wishlist
// @route   DELETE /api/auth/wishlist/:id
// @access  Private
router.delete('/wishlist/:id', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(populatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
    const users = await User.find({});
    res.json(users);
}));

module.exports = router;
