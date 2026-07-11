const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./models/Blog');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/seraweb';

const seoBlogs = [
  {
    title: "What is Anti-Tarnish Jewellery? The Complete Guide",
    slug: "what-is-anti-tarnish-jewellery-complete-guide",
    seoTitle: "What is Anti-Tarnish Jewellery? | Sera Jewels Guide",
    seoDescription: "Discover what anti-tarnish jewellery is, how it's made using PVD plating, and why stainless steel is the best waterproof base material.",
    tags: ["education", "anti-tarnish", "materials"],
    isPublished: true,
    coverImage: "", // Purposefully left blank for minimalist aesthetic
    content: `
      <h2>The Secret Behind Everyday Luxury</h2>
      <p>Have you ever bought a beautiful piece of jewellery only to find it turning copper-colored or leaving a green mark on your skin just a few weeks later? That's the reality of cheap fast-fashion jewellery. But there is a better way.</p>
      
      <h2>What Makes Jewellery "Anti-Tarnish"?</h2>
      <p>Anti-tarnish jewellery is specifically engineered to resist oxidation. At Sera, we achieve this by using a high-grade stainless steel base. Unlike brass or copper, stainless steel is inherently durable and rust-resistant.</p>
      
      <p>We then use an advanced process called <strong>Physical Vapor Deposition (PVD)</strong> plating. This bonds a premium finish to the steel at a molecular level, creating a coating that is up to 10 times thicker than standard plating.</p>

      <h2>Waterproof and Skin-Friendly</h2>
      <p>Because of these materials, our <a href="/shop/rings">minimalist rings</a> and <a href="/shop/necklaces">dainty necklaces</a> are entirely waterproof. You can wear them in the shower or during a workout without fear.</p>
      
      <p>Shop our entire <a href="/shop">affordable anti-tarnish collection</a> to experience the difference.</p>
    `
  },
  {
    title: "Aesthetic Jewellery Trends 2024: The Minimalist Movement",
    slug: "aesthetic-jewellery-trends-2024-minimalist",
    seoTitle: "Aesthetic Minimalist Jewellery Trends 2024 | Sera",
    seoDescription: "Explore the top aesthetic and minimalist jewellery trends for 2024. Learn how to style dainty necklaces and stackable rings for an effortless look.",
    tags: ["trends", "aesthetic", "minimalist"],
    isPublished: true,
    coverImage: "", 
    content: `
      <h2>Less is More: The 2024 Minimalist Movement</h2>
      <p>This year, the aesthetic jewellery trend is all about "clean girl" aesthetics and understated elegance. Chunky, heavy statement pieces are taking a backseat to delicate, skin-hugging luxury.</p>

      <h2>Stackable Waterproof Rings</h2>
      <p>The art of stacking rings is stronger than ever. The key is mixing textures while keeping the profile slim. Because you'll be wearing these everyday, opting for <a href="/shop/rings">waterproof anti-tarnish rings</a> is essential so you don't have to take them off every time you wash your hands.</p>

      <h2>Dainty Layered Necklaces</h2>
      <p>Layering two or three thin chains adds dimension without clutter. Start with a short choker-length chain and add a slightly longer pendant necklace. Our <a href="/shop/necklaces">minimalist necklaces collection</a> is perfectly curated for effortless layering.</p>

      <p>Upgrade your daily aesthetic with our curated <a href="/shop">Sera collection</a>.</p>
    `
  }
];

async function seedSEO() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user for author field
    let adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No admin user found. Falling back to the first user...');
      adminUser = await User.findOne({});
      if (!adminUser) {
         console.log('No users found at all. Creating a dummy user...');
         adminUser = await User.create({
          name: 'Sera Jewels',
          email: 'hello@serastore.in',
          password: 'temporarypassword123',
          phone: '1234567890',
          isAdmin: true
        });
      }
    }

    for (let blogData of seoBlogs) {
      blogData.author = adminUser._id;
      
      // Update if exists, otherwise create
      await Blog.findOneAndUpdate(
        { slug: blogData.slug },
        { $set: blogData },
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded: ${blogData.title}`);
    }

    console.log('🎉 SEO Blogs seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding SEO blogs:', error);
    process.exit(1);
  }
}

seedSEO();
