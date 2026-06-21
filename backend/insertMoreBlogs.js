require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');

const blogs = [
  {
    title: "Where to Find the Best Anti-Tarnish Jewellery for Everyday Wear",
    slug: "best-anti-tarnish-jewellery-everyday",
    content: `
      <h2>The Secret to Jewellery That Never Fades</h2>
      <p>If you are tired of your favourite rings and necklaces losing their golden shine after just a few wears, you are not alone. The search for the <strong>best anti tarnish jewellery</strong> is one of the biggest trends in fashion right now. But what actually makes a piece of jewellery tarnish free?</p>
      
      <h3>Why Solid Gold Isn't the Only Option</h3>
      <p>For decades, women believed that solid 14k or 18k gold was the only way to avoid tarnishing. However, the best anti tarnish jewellery on the market today uses a much more accessible secret: surgical grade stainless steel combined with advanced PVD gold plating. This method creates a bond so strong that the jewellery becomes incredibly resistant to water, sweat, and daily wear and tear.</p>
      
      <h3>How to Spot the Best Anti Tarnish Pieces</h3>
      <p>When shopping for everyday wear, look for these key indicators:</p>
      <ul>
        <li><strong>Base Metal:</strong> The best pieces use stainless steel or titanium, not cheap copper or nickel.</li>
        <li><strong>Plating Method:</strong> Look for PVD (Physical Vapor Deposition) plating, which lasts much longer than traditional electroplating.</li>
        <li><strong>Hypoallergenic Labels:</strong> True anti-tarnish jewellery is almost always skin friendly and hypoallergenic.</li>
      </ul>
      
      <h3>Sera Jewels: Your Destination for Durability</h3>
      <p>We designed our collection specifically for the modern woman who does not have time to take off her jewellery before hitting the shower or the gym. Discover our range of the best anti tarnish necklaces, rings, and earrings that are guaranteed to keep their stunning golden hue day in and day out.</p>
    `,
    seoTitle: "Best Anti-Tarnish Jewellery | Water-Resistant Everyday Wear",
    seoDescription: "Searching for the best anti-tarnish jewellery? Discover why PVD plated stainless steel is the secret to waterproof, sweatproof, and fade-resistant accessories.",
    tags: ["best anti tarnish", "waterproof jewellery", "everyday wear", "tarnish free"],
    isPublished: true,
  },
  {
    title: "Curating the Perfect Look: The Best Minimalist Jewellery Pieces",
    slug: "curating-perfect-look-best-minimalist-jewellery",
    content: `
      <h2>The Power of Subtle Elegance</h2>
      <p>In a world of loud fashion trends and oversized accessories, minimalism offers a breath of fresh air. The <strong>best minimalist jewellery</strong> doesn't shout for attention; instead, it quietly enhances your natural beauty and complements your outfit flawlessly. Whether you are building a capsule wardrobe or just love clean aesthetics, here is how to find the best minimalist pieces.</p>
      
      <h3>What Makes the "Best" Minimalist Jewellery?</h3>
      <p>The core philosophy of minimalism is "less is more." The best minimalist jewellery focuses on pure geometric shapes, thin delicate chains, and a lack of excessive gemstones or clutter. A simple, perfectly polished gold dome ring or a sleek snake chain necklace are prime examples of this aesthetic.</p>
      
      <h3>Must Have Minimalist Essentials</h3>
      <ul>
        <li><strong>The Everyday Huggie Hoops:</strong> These sit close to the earlobe and provide a tiny flash of gold without getting in the way.</li>
        <li><strong>The Herringbone Chain:</strong> A classic, fluid chain that catches the light beautifully and sits flat against the collarbone.</li>
        <li><strong>The Stacking Band:</strong> Thin, plain gold bands that can be worn alone for a subtle look, or stacked together for more impact.</li>
      </ul>
      
      <p>Finding the right balance is key. By investing in the best minimalist jewellery, you ensure that your accessories will never go out of style. Explore the Sera collection to find timeless, clean designs that you will reach for every single morning.</p>
    `,
    seoTitle: "Best Minimalist Jewellery: Timeless & Elegant Pieces | Sera",
    seoDescription: "Discover the best minimalist jewellery essentials for your capsule wardrobe. Shop sleek rings, delicate chains, and elegant everyday earrings.",
    tags: ["best minimalist", "simple jewellery", "capsule wardrobe", "elegant"],
    isPublished: true,
  },
  {
    title: "How to Shop for the Best Affordable Jewellery That Looks Expensive",
    slug: "shop-best-affordable-jewellery-looks-expensive",
    content: `
      <h2>Luxury Without the High Price Tag</h2>
      <p>We all love the look of high-end, luxury accessories, but spending a fortune on a single piece is not always practical. The good news? You do not have to. Finding the <strong>best affordable jewellery</strong> that still looks incredibly expensive is entirely possible if you know what to look for.</p>
      
      <h3>Affordable Luxury vs. Fast Fashion</h3>
      <p>There is a massive difference between cheap fast fashion jewellery and true affordable luxury. Fast fashion pieces often use poor base metals that turn green within days and feel incredibly lightweight and flimsy. The best affordable jewellery, on the other hand, utilizes high quality materials like stainless steel or brass, providing a satisfying weight and a premium feel.</p>
      
      <h3>Tips for Buying the Best Affordable Jewellery</h3>
      <ul>
        <li><strong>Check the Weight:</strong> Quality pieces have a bit of substance to them. If it feels like hollow plastic, it will look cheap.</li>
        <li><strong>Look at the Gold Tone:</strong> Extremely yellow or brassy tones look unnatural. The best affordable jewellery uses a softer, more realistic 14k or 18k gold tone.</li>
        <li><strong>Focus on Finish:</strong> Check for a smooth, high-polish finish without any visible seams or rough edges.</li>
      </ul>
      
      <h3>Why Sera is the Smart Choice</h3>
      <p>At Sera Jewels, we bridge the gap between premium quality and accessible pricing. We believe that every woman deserves to wear beautiful, confidence-boosting accessories. By focusing on direct-to-consumer models and intelligent material sourcing, we are proud to offer some of the best affordable jewellery on the market today. You get the premium luxury experience, without the luxury markup.</p>
    `,
    seoTitle: "Best Affordable Jewellery That Looks Expensive | Sera Jewels",
    seoDescription: "Learn how to find the best affordable jewellery that looks like true luxury. Discover high-quality, budget-friendly pieces that never look cheap.",
    tags: ["best affordable jewellery", "affordable luxury", "budget style", "expensive look"],
    isPublished: true,
  }
];

const insertData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an admin user to set as the author
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found. Please create an admin first.');
      process.exit(1);
    }

    // Assign author ID and clear coverImage (user wants to add photos later)
    const blogsToInsert = blogs.map(blog => ({
      ...blog,
      author: admin._id,
      coverImage: '' 
    }));

    // Insert blogs
    await Blog.insertMany(blogsToInsert);
    console.log('Successfully inserted 3 more HIGHLY TARGETED SEO blog posts!');
    
    process.exit();
  } catch (error) {
    console.error('Error inserting blogs:', error);
    process.exit(1);
  }
};

insertData();
