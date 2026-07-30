require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');

const seoBlogs = [
  {
    title: "The Ultimate Ear Stacking Guide: How to Layer Earrings Like a Pro",
    slug: "ultimate-ear-stacking-guide",
    content: `
      <h2>Mastering the Art of the Ear Stack</h2>
      <p>Ear stacking is no longer just a trend—it's a form of self-expression. Curating the perfect combination of hoops, huggies, and studs allows you to create a look that is entirely unique to you. Whether you have two piercings or ten, building an ear stack is an art form. Here is our ultimate guide to layering earrings effortlessly.</p>
      
      <h3>The Rule of Cascading Size</h3>
      <p>The most visually pleasing ear stacks follow a simple rule: start largest at the bottom and get progressively smaller as you move up the lobe. Wear your statement hoops in the first piercing, transition to snug huggies in the second and third, and finish with delicate studs in your cartilage or upper lobe.</p>
      
      <h3>Mixing Textures, Matching Tones</h3>
      <p>While we love the clean look of an all-gold stack, the secret to a professional-looking ear curation is mixing textures. Pair a smooth, high-polish hoop with a twisted or textured huggie. This creates visual interest without looking cluttered. At Sera, our signature 18k gold PVD finish ensures that all your pieces match perfectly in tone, even when you mix styles.</p>
      
      <h3>The "Anchor" Piece</h3>
      <p>Every great stack needs an anchor—the piece that draws the eye first. This is usually worn in the primary lobe piercing. Choose a bold, chunky hoop or an elongated drop earring to set the foundation, then build the rest of your stack around it to complement its shape.</p>
      
      <p>Ready to build your dream stack? All Sera earrings are crafted from hypoallergenic, waterproof stainless steel, meaning you can curate your ear and leave your stack in for the shower, the gym, and sleep without any tarnishing or irritation. <a href="/shop/earrings">Shop our Earrings collection</a> to find your next everyday staple.</p>
    `,
    seoTitle: "Ear Stacking Guide | How to Layer Earrings | Sera Jewels",
    seoDescription: "Learn how to curate the perfect ear stack. Our expert guide on layering hoops, huggies, and studs for a flawless everyday look.",
    tags: ["ear stacking", "how to layer earrings", "jewelry styling", "gold hoops"],
    isPublished: true,
  },
  {
    title: "How to Layer Necklaces: The Secret to a Tangle-Free Neck Mess",
    slug: "how-to-layer-necklaces-tangle-free",
    content: `
      <h2>The Anatomy of the Perfect Necklace Stack</h2>
      <p>A perfectly layered "neck mess" can elevate a simple white t-shirt into a styled, intentional outfit. But achieving that effortless layered look without ending up in a tangled knot can be tricky. Here is the Sera guide to layering necklaces flawlessly.</p>
      
      <h3>Step 1: The Choker Base (14"-15")</h3>
      <p>Always start with your shortest layer to establish the foundation. A sleek herringbone chain, a simple snake chain, or a beaded choker sits right at the collarbone and prevents longer chains from slipping underneath each other. This creates a solid, shiny base for your stack.</p>
      
      <h3>Step 2: The Everyday Essential (16"-18")</h3>
      <p>Your middle layer should add texture or a focal point. This is the perfect spot for a delicate pendant, an initial necklace, or a coin medallion. Ensure there is at least a 1.5 to 2-inch difference between your base layer and this middle layer so both pieces have room to breathe.</p>
      
      <h3>Step 3: The Elongated Statement (20"+)</h3>
      <p>Finish your stack with a longer chain to draw the eye down and elongate the neck. A lariat necklace, a bold chain link, or a larger pendant works beautifully here. The varying weights and lengths are the secret to keeping your necklaces from tangling throughout the day.</p>
      
      <h3>The Anti-Tangle Trick</h3>
      <p>Tired of your necklaces twisting into a knot? The secret is mixing chain weights. Don't layer three dainty cable chains together. Instead, mix a flat herringbone with a chunky paperclip chain and a delicate pendant chain. Different weights move differently, drastically reducing the chance of them wrapping around each other.</p>
      
      <p>Because Sera necklaces feature built-in extenders and are crafted with sweatproof, anti-tarnish technology, you can find your perfect lengths and never take your stack off. Explore our <a href="/shop/necklaces">Necklace Collection</a> and start building your signature layers today.</p>
    `,
    seoTitle: "How to Layer Necklaces | Tangle-Free Stacking Guide",
    seoDescription: "Master the art of layering necklaces without tangling. Discover the perfect lengths, chain weights, and styling tricks for a flawless neck stack.",
    tags: ["layering necklaces", "necklace lengths", "jewelry styling", "anti-tarnish necklaces"],
    isPublished: true,
  }
];

async function seedSeoBlogs() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("No MONGODB_URI found in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Find the admin user to assign as author
    const adminUser = await User.findOne({ role: 'admin' });
    let authorId = null;
    
    if (adminUser) {
      authorId = adminUser._id;
    } else {
      console.log("No admin user found. Creating a temporary author...");
      const tempAuthor = await User.create({
        name: 'Sera Editorial Team',
        email: 'editorial@serastore.in',
        password: 'temporary_password', // Doesn't matter, won't be used to login
        role: 'admin'
      });
      authorId = tempAuthor._id;
    }

    // Insert blogs
    const blogsWithAuthor = seoBlogs.map(blog => ({
      ...blog,
      author: authorId,
      coverImage: 'https://res.cloudinary.com/dtmtn6eut/image/upload/v1720894563/a1q25uiz47wft1xep91p.jpg' // Using a generic placeholder from their cloudinary
    }));

    for (let blog of blogsWithAuthor) {
      // Check if already exists by slug
      const exists = await Blog.findOne({ slug: blog.slug });
      if (!exists) {
        await Blog.create(blog);
        console.log(`✅ Inserted: ${blog.title}`);
      } else {
        console.log(`⏭️ Skipped (already exists): ${blog.title}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding SEO blogs:", error);
    process.exit(1);
  }
}

seedSeoBlogs();
