const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ FIXED CORS - All Vercel + Local
const allowedOrigins = [
 'http://localhost:5173',
  'http://127.0.0.1:5173', 
  'http://192.168.29.61:5173',
  'https://serastore.in',           // ✅ Production root
  'https://www.serastore.in',       // ✅ Production www
  'https://seraweb.vercel.app',
  'https://serajewels.vercel.app',
  'https://*.vercel.app'            // Preview deploys
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests
    if (!origin) return callback(null, true);
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel preview URLs (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ DB Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/sitemap.xml', require('./routes/sitemapRoutes'));

const path = require('path');
// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/static/uploads')));

// ✅ ADD THIS - Health Check Endpoint
app.get('/api/healthcheck', async (req, res) => {
  try {
    // Ping the database to keep the MongoDB connection pool active and warm
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.command({ ping: 1 });
    }

    res.status(200).json({ 
      status: 'ok', 
      message: 'SERA backend is running and DB is warm',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database ping failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export for Vercel
module.exports = app;

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
