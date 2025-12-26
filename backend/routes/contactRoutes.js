const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  const contact = await Contact.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json(contact);
}));

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
}));

module.exports = router;