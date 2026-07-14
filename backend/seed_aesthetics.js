require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const AESTHETICS = [
  "boho vibes",
  "minimalist",
  "accent pairs",
  "everyday essential",
  "bestsellers"
];

async function seedAesthetics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const products = await Product.find({});
    
    for (const product of products) {
      // Pick 2 random aesthetics for each product
      const shuffled = AESTHETICS.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);
      
      product.aesthetics = selected;
      await product.save();
    }

    console.log(`Updated ${products.length} products with aesthetic tags.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedAesthetics();
