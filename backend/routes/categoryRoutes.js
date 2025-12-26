const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
}));

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { name, image, description } = req.body;
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    image,
    description
  });

  res.status(201).json(category);
}));

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
}));

module.exports = router;