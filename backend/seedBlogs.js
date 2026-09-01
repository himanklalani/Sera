const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedBlogs = async () => {
  await connectDB();

  try {
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Cannot seed blogs.');
      process.exit(1);
    }

    await Blog.deleteMany({});
    
    const blogs = [
      {
        title: "Why Anti-Tarnish Jewelry is the Ultimate Everyday Luxury",
        slug: "why-anti-tarnish-jewelry-is-everyday-luxury",
        content: `<h2>The Modern Standard for Jewelry</h2>
<p>We all know the heartbreak of buying a beautiful piece of jewelry, only to watch it fade, turn green, or lose its shine after a few weeks of wear. Enter <strong>anti-tarnish jewelry</strong>.</p>
<h3>Long-Lasting Shine</h3>
<p>Anti-tarnish jewelry is engineered with a specialized protective coating that creates a barrier against air, moisture, and everyday elements. This means the pieces retain their original luster and shine significantly longer than standard fashion jewelry.</p>
<h3>Low Maintenance</h3>
<p>No one wants to spend their weekends polishing metal. One of the biggest benefits of anti-tarnish pieces is the minimal upkeep required. You can wear them daily without the constant worry of wiping them down.</p>
<h3>Skin-Friendly Comfort</h3>
<p>Many people suffer from sensitive skin that reacts poorly to cheap metals. High-quality anti-tarnish jewelry is hypoallergenic and skin-friendly, ensuring comfort throughout the day.</p>
<p>If you are looking for an affordable, durable, and luxurious option for everyday wear, it is time to upgrade your collection.</p>
<p><a href="/shop">Buy anti-tarnish jewelry</a></p>`,
        coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780229969/hero_zvkcsm.avif",
        seoTitle: "Why Anti-Tarnish Jewelry is the Ultimate Everyday Luxury | Sera",
        seoDescription: "Discover the benefits of anti-tarnish waterproof jewelry. Learn why it offers long-lasting shine, low maintenance, and is perfect for sensitive skin.",
        tags: ["anti-tarnish", "waterproof", "jewelry care"],
        isPublished: true,
        author: adminUser._id
      },
      {
        title: "Cotton Blend vs. Pure Cotton: Which is Better for Everyday Wear?",
        slug: "cotton-blend-vs-pure-cotton-tops",
        content: `<h2>Choosing the Right Fabric for Your Lifestyle</h2>
<p>When shopping for women's tops, the fabric choice can make or break the garment. Let's compare pure cotton with the increasingly popular <strong>cotton blend</strong>.</p>
<h3>The Benefits of Pure Cotton</h3>
<p>Pure cotton is beloved for its exceptional breathability. It acts as a natural air conditioner and is completely hypoallergenic, making it ideal for hot climates or sensitive skin. However, it is prone to wrinkling and can lose its shape after frequent washing.</p>
<h3>Why We Love Cotton Blends</h3>
<p>A cotton blend combines natural cotton with synthetic fibers like elastane or polyester. This engineering results in a fabric that holds its shape better and resists fading and shrinking.</p>
<p><strong>Practicality for Everyday Wear:</strong></p>
<p>Cotton blends are largely wrinkle-resistant, meaning you spend less time ironing and more time living. They offer the perfect balance of breathability and durability, making them ideal for the office, travel, or daily commutes.</p>
<p>At Sera, we prioritize premium cotton blends to ensure your chic tops look flawless from morning to night.</p>
<p><a href="/shop/apparel">Shop premium cotton blend tops</a></p>`,
        coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1788169399/aparrel_jtnjpa.avif",
        seoTitle: "Cotton Blend vs. Pure Cotton Women's Tops | Sera",
        seoDescription: "Compare the benefits of cotton blend vs pure cotton tops. Learn why premium cotton blends offer better durability, wrinkle resistance, and shape retention.",
        tags: ["apparel", "cotton blend", "fashion tips"],
        isPublished: true,
        author: adminUser._id
      },
      {
        title: "5 Waterproof Jewelry Gift Ideas She Will Actually Wear",
        slug: "5-waterproof-jewelry-gift-ideas-for-her",
        content: `<h2>Finding the Perfect Gift</h2>
<p>Finding a gift for her that is both beautiful and practical can be a challenge. You want something she will love, but also something she can actually wear every day without worrying about damage. <strong>Waterproof and anti-tarnish jewelry</strong> is the perfect solution.</p>
<p>Here are 5 ideas for a memorable gift:</p>
<h3>1. Minimalist Layered Necklaces</h3>
<p>A delicate layered necklace adds elegance to any outfit. Choosing a waterproof option means she can wear it to the gym, in the shower, or out to dinner without taking it off.</p>
<h3>2. Matching Combo Sets</h3>
<p>Take the guesswork out of styling with a curated matching jewelry combo. A coordinated necklace and earring set is perfect for anniversaries or birthday gifts.</p>
<h3>3. Everyday Huggie Hoops</h3>
<p>Huggie earrings are the ultimate everyday staple. Anti-tarnish huggies offer a premium look that lasts.</p>
<h3>4. Statement Bracelets</h3>
<p>A bold cuff or chain bracelet makes a fantastic gift. Because our pieces are sweatproof, they hold up beautifully to daily wear and tear.</p>
<p>Give the gift of everyday luxury.</p>
<p><a href="/shop/collection/combos">Shop Jewelry Combo Sets</a></p>
<p><a href="/gifts">Explore our Gifting Hub</a></p>`,
        coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1782307100/jewelry-products/zvcq5yqjtbwlk2etcrmx.jpg",
        seoTitle: "5 Waterproof Jewelry Gift Ideas For Her | Sera Combos",
        seoDescription: "Discover 5 waterproof and anti-tarnish jewelry gift ideas she will actually wear. From matching combo sets to everyday necklaces for anniversaries and birthdays.",
        tags: ["gifting", "combos", "waterproof"],
        isPublished: true,
        author: adminUser._id
      }
    ];

    await Blog.insertMany(blogs);
    console.log('SEO Blogs Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedBlogs();
