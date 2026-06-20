const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected');
    const Newsletter = require('./models/Newsletter');
    const subs = await Newsletter.find({});
    console.log('Subscriptions:', subs);
    process.exit(0);
  })
  .catch(err => console.error(err));
