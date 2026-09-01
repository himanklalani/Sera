const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  // If user is admin, they might want to see all including unpublished. We'll handle that via query param.
  const filter = {};
  if (req.query.all !== 'true') {
    filter.isPublished = true;
  }
  
  const blogs = await Blog.find(filter)
    .populate('author', 'name')
    .sort({ createdAt: -1 });
  res.json(blogs);
}));

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name');

  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
}));

// @desc    WhatsApp/Social Share Interceptor for dynamic OG Tags for Blogs
// @route   GET /api/blogs/share/:slug
// @access  Public
router.get('/share/:slug', asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).lean();
  
  if (!blog) {
    return res.status(404).send('Blog not found');
  }

  const frontendUrl = `https://www.serastore.in/journal/${blog.slug}`;
  const imageUrl = blog.coverImage || 'https://www.serastore.in/logo.avif';
  const title = blog.seoTitle || `${blog.title} | Sera Jewels`;
  const description = blog.seoDescription || blog.title;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      
      <!-- Open Graph / WhatsApp / Facebook -->
      <meta property="og:type" content="article">
      <meta property="og:url" content="${frontendUrl}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${imageUrl}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${imageUrl}">
      
      <!-- Redirect human users to the actual React app -->
      <meta http-equiv="refresh" content="0;url=${frontendUrl}">
      
      <script>
        // Fallback JS redirect just in case meta refresh fails
        window.location.href = "${frontendUrl}";
      </script>
    </head>
    <body>
      <p>Redirecting to ${blog.title}... <a href="${frontendUrl}">Click here</a> if not redirected automatically.</p>
    </body>
    </html>
  `;

  res.send(html);
}));

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { title, slug, content, coverImage, seoTitle, seoDescription, tags, isPublished } = req.body;

  const blogExists = await Blog.findOne({ slug });
  if (blogExists) {
    res.status(400);
    throw new Error('Blog with this slug already exists');
  }

  const blog = new Blog({
    title,
    slug,
    content,
    coverImage,
    seoTitle,
    seoDescription,
    tags,
    isPublished,
    author: req.user._id,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
}));

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const { title, slug, content, coverImage, seoTitle, seoDescription, tags, isPublished } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    // If changing slug, ensure it's not taken by another blog
    if (slug !== blog.slug) {
      const slugExists = await Blog.findOne({ slug });
      if (slugExists) {
        res.status(400);
        throw new Error('Another blog with this slug already exists');
      }
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.content = content !== undefined ? content : blog.content;
    blog.coverImage = coverImage !== undefined ? coverImage : blog.coverImage;
    blog.seoTitle = seoTitle !== undefined ? seoTitle : blog.seoTitle;
    blog.seoDescription = seoDescription !== undefined ? seoDescription : blog.seoDescription;
    blog.tags = tags !== undefined ? tags : blog.tags;
    blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
}));

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
}));

module.exports = router;
