const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

// Load env vars
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedGreetingCard = async () => {
  try {
    const existingCard = await Product.findOne({ name: 'Greeting Card' });
    
    if (existingCard) {
      console.log('Greeting Card already exists in the database.');
      process.exit();
    }

    let adminUser = await User.findOne();
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@sera.com',
        password: 'password123',
        isAdmin: true
      });
    }

    const greetingCard = new Product({
      name: 'Greeting Card',
      description: 'A beautiful greeting card for your personalized note.',
      price: 15,
      stock: 999999,
      category: 'add-on',
      images: ['https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto/q_auto/v1788173333/bdaycard_yl0wq5.avif'],
      isAddon: true,
      features: ['Personalized Note'],
      user: adminUser._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await greetingCard.save();
    console.log('Greeting Card successfully seeded.');
    process.exit();
  } catch (error) {
    console.error('Error seeding greeting card:', error);
    process.exit(1);
  }
};

seedGreetingCard();
