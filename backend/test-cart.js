const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB. Testing Abandoned Cart query...');
    const Cart = require('./models/Cart');
    require('./models/User'); // ensure models are registered
    require('./models/Product');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const carts = await Cart.find({ 
      updatedAt: { $gte: sevenDaysAgo },
      'items.0': { $exists: true } 
    })
    .populate('user', 'name email phone')
    .populate('items.product', 'name price images')
    .sort({ updatedAt: -1 });

    const validCarts = carts.filter(cart => cart.user);
    console.log(`Found ${validCarts.length} active carts updated in the last 7 days.`);
    
    if (validCarts.length > 0) {
      console.log('Sample cart data:', JSON.stringify(validCarts[0], null, 2));
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
