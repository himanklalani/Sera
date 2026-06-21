require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');

const blogs = [
  {
    title: "The Rise of Affordable Minimalist Jewellery in India",
    slug: "affordable-minimalist-jewellery-india",
    content: `
      <h2>Why Less is More When it Comes to Everyday Style</h2>
      <p>The modern Indian wardrobe has evolved. Gone are the days when heavy, traditional gold pieces were the only acceptable form of adornment. Today, millennials and Gen Z are shifting towards <strong>affordable minimalist jewellery</strong>. Brands like Salty have paved the way, but discerning shoppers are now looking for the next level of quality and design without breaking the bank.</p>
      
      <h3>The Appeal of Minimalist Aesthetics</h3>
      <p>Minimalist jewellery is all about clean lines, subtle elegance, and versatility. Whether you are heading to a corporate meeting or a casual brunch, a simple layered necklace or a pair of sleek hoop earrings can elevate your outfit instantly. The beauty of minimalism lies in its ability to complement your look rather than overpower it.</p>
      
      <h3>Why Affordability Matters</h3>
      <p>Fashion moves fast. Investing thousands of rupees into a single piece of trend-based jewellery is no longer practical. Affordable luxury allows you to curate a versatile jewellery box. You can mix and match different rings, stack your bracelets, and swap out your necklaces daily. Sera Jewels focuses exactly on this: providing high-end aesthetics at accessible price points.</p>
      
      <h3>How to Style Minimalist Pieces</h3>
      <ul>
        <li><strong>Layering:</strong> Start with a delicate choker and add a longer pendant necklace.</li>
        <li><strong>Stacking:</strong> Combine different textures of rings on one hand for a curated look.</li>
        <li><strong>Statement Simplicity:</strong> Let one standout piece, like a thick gold dome ring, speak for itself.</li>
      </ul>
      
      <p>Ready to upgrade your everyday look? Explore our collection of minimalist essentials designed for the modern woman.</p>
    `,
    seoTitle: "Best Affordable Minimalist Jewellery in India | Sera Jewels",
    seoDescription: "Discover why affordable minimalist jewellery is taking over India. Learn how to style everyday pieces and find alternatives to expensive brands.",
    tags: ["affordable jewellery", "minimalist jewellery", "everyday wear", "styling guide"],
    isPublished: true,
  },
  {
    title: "The Ultimate Guide to Anti-Tarnish Jewellery",
    slug: "ultimate-guide-anti-tarnish-jewellery",
    content: `
      <h2>Say Goodbye to Green Fingers and Faded Gold</h2>
      <p>There is nothing more frustrating than buying a beautiful piece of jewellery, only for it to turn your skin green or lose its shine after a few weeks. This is why <strong>anti-tarnish jewellery</strong> has become the most sought after category in fashion accessories today.</p>
      
      <h3>What Exactly is Anti-Tarnish Jewellery?</h3>
      <p>Anti-tarnish jewellery is typically crafted from durable base metals like stainless steel or brass, and then coated with a highly resilient plating, often 18k gold. Advanced techniques like PVD (Physical Vapor Deposition) coating are used to ensure that the gold layer bonds deeply with the base metal. This makes the jewellery resistant to sweat, water, and everyday wear.</p>
      
      <h3>Why You Need It in Your Collection</h3>
      <p>If you live an active lifestyle, hit the gym, or simply do not want the hassle of removing your rings every time you wash your hands, anti-tarnish pieces are a game changer. They offer the luxurious look of solid gold but require a fraction of the maintenance.</p>
      
      <h3>Care Tips for Long Lasting Shine</h3>
      <p>While anti-tarnish jewellery is highly durable, taking basic care of it will ensure it lasts for years:</p>
      <ul>
        <li>Avoid direct contact with harsh chemicals like perfumes and lotions.</li>
        <li>Store your pieces in a dry, cool place, preferably in the pouch they came in.</li>
        <li>Gently wipe them with a microfiber cloth after a long day of wear.</li>
      </ul>
      
      <p>At Sera Jewels, we pride ourselves on offering premium anti-tarnish options that keep up with your lifestyle. Shop our water resistant collection today.</p>
    `,
    seoTitle: "Anti-Tarnish Jewellery Guide: Water Resistant & Durable | Sera",
    seoDescription: "Learn everything about anti-tarnish and water-resistant jewellery. Say goodbye to green skin and fading gold with our durable everyday pieces.",
    tags: ["anti tarnish", "water resistant", "stainless steel", "jewellery care"],
    isPublished: true,
  },
  {
    title: "5 Office Wear Jewellery Rules You Need to Know",
    slug: "office-wear-jewellery-rules",
    content: `
      <h2>Mastering the Art of Professional Elegance</h2>
      <p>Choosing the right jewellery for the office can be tricky. You want to express your personal style, but you also need to maintain a polished and professional appearance. Here are the top five rules for nailing your office wear jewellery game.</p>
      
      <h3>1. Stick to the Rule of Three</h3>
      <p>In a professional setting, less is always more. Try to limit yourself to three main pieces of jewellery. For example, a watch, a pair of stud earrings, and a subtle ring. This ensures your accessories do not distract from your professional presence.</p>
      
      <h3>2. Avoid Noisy Bracelets</h3>
      <p>If you type on a keyboard all day, clinking bangles can be highly distracting to you and your coworkers. Opt for a sleek, silent chain bracelet or a classic watch instead.</p>
      
      <h3>3. Opt for Subtle Necklaces</h3>
      <p>A simple pendant or a delicate herringbone chain looks incredibly chic under the collar of a crisp button down shirt. Avoid chunky, oversized statement necklaces that might clash with office attire.</p>
      
      <h3>4. Invest in Classic Studs or Small Hoops</h3>
      <p>Earrings are the most visible piece of jewellery during virtual meetings. Classic pearl studs, small gold huggies, or simple geometric shapes frame the face beautifully without being overwhelming.</p>
      
      <h3>5. Quality Over Quantity</h3>
      <p>In the workplace, the quality of your accessories speaks volumes. This is where affordable luxury brands shine. Investing in a few high quality, anti-tarnish pieces will serve you much better than a drawer full of cheap fashion jewellery that chips and fades.</p>
      
      <p>Elevate your work wardrobe with our curated selection of office appropriate minimalist jewellery.</p>
    `,
    seoTitle: "Office Wear Jewellery Rules: Professional & Minimalist | Sera",
    seoDescription: "Master professional elegance with these 5 office wear jewellery rules. Find the perfect minimalist pieces for work, meetings, and everyday office style.",
    tags: ["office wear", "styling guide", "professional style", "minimalist"],
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
    console.log('Successfully inserted 3 SEO blog posts!');
    
    process.exit();
  } catch (error) {
    console.error('Error inserting blogs:', error);
    process.exit(1);
  }
};

insertData();
