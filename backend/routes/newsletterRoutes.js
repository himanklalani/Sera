const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Newsletter = require('../models/Newsletter');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const existingSub = await Newsletter.findOne({ email });

  if (existingSub) {
    res.status(400);
    throw new Error('Email is already subscribed');
  }

  const subscription = await Newsletter.create({ email });

  if (subscription) {
    res.status(201).json({ message: 'Successfully subscribed' });
  } else {
    res.status(400);
    throw new Error('Invalid subscription data');
  }
}));

// @desc    Get all subscriptions
// @route   GET /api/newsletter
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const subscriptions = await Newsletter.find({}).sort({ createdAt: -1 });
  res.json(subscriptions);
}));

module.exports = router;
