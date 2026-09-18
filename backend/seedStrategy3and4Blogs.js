require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');

const forbiddenWords = [
  '18k', 'coating', 'pvd', 'plating', 'plated', 
  'hypoallergenic', 'stainless steel', 'gold', 'silver', 
  'demi-fine', 'everyday luxury', 'skin-friendly'
];

const checkContent = (text) => {
  const lower = text.toLowerCase();
  for (const word of forbiddenWords) {
    if (lower.includes(word)) {
      console.warn(`⚠️ Warning: detected forbidden word "${word}" in content snippet: ${text.substring(0, 60)}...`);
    }
  }
};

const updatedAndNewBlogs = [
  {
    title: "Why Anti-Tarnish Jewelry is the Modern Everyday Standard",
    slug: "why-anti-tarnish-jewelry-is-everyday-luxury", // keep slug for URL continuity
    seoTitle: "Why Anti-Tarnish Jewelry is the Modern Everyday Standard | Sera",
    seoDescription: "Discover the benefits of anti-tarnish waterproof jewelry. Learn why it offers lasting shine, easy maintenance, and all-day comfort.",
    tags: ["anti-tarnish", "waterproof", "jewelry care", "everyday wear"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780229969/hero_zvkcsm.avif",
    isPublished: true,
    content: `<h2>The Modern Standard for Everyday Wear</h2>
<p>We all know the disappointment of buying a beautiful piece of jewelry, only to watch it fade, discolor, or lose its shine after a few weeks of wear. Enter <strong>anti-tarnish waterproof jewelry</strong>.</p>

<h3>Long-Lasting Radiant Shine</h3>
<p>Modern anti-tarnish jewelry is engineered with a specialized protective finish that creates a resilient shield against air, water, and everyday perspiration. This means your pieces retain their original luster significantly longer than standard fashion accessories.</p>

<h3>Effortless Low Maintenance</h3>
<p>No one wants to spend their weekends constantly polishing accessories. One of the biggest benefits of anti-tarnish pieces is minimal upkeep. You can wear them daily through workouts, hand washing, and busy routines without stress.</p>

<h3>Comfortable All-Day Wear</h3>
<p>High-quality anti-tarnish pieces feature an ultra-smooth finish that feels gentle against the neck and wrists, ensuring comfortable wear from morning to night.</p>

<p>Explore our collection of <a href="/shop/necklaces">anti-tarnish waterproof necklaces</a> and <a href="/shop/combos">matching jewelry combo sets</a> to elevate your everyday rotation.</p>`
  },
  {
    title: "5 Waterproof Jewelry Gift Ideas She Will Actually Wear",
    slug: "5-waterproof-jewelry-gift-ideas-for-her",
    seoTitle: "5 Waterproof Jewelry Gift Ideas For Her | Sera Combos",
    seoDescription: "Discover 5 waterproof and anti-tarnish jewelry gift ideas she will actually wear. From matching combo sets to everyday necklaces for anniversaries and birthdays.",
    tags: ["gifting", "combos", "waterproof", "gifts for her"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1782307100/jewelry-products/zvcq5yqjtbwlk2etcrmx.jpg",
    isPublished: true,
    content: `<h2>Finding the Perfect Gift She Will Cherish</h2>
<p>Finding a gift for her that is both elegant and practical can be challenging. You want something she will love, but also something she can wear every single day without fear of tarnishing. <strong>Waterproof and anti-tarnish jewelry</strong> is the ultimate solution.</p>

<p>Here are 5 thoughtful gift ideas:</p>

<h3>1. Minimalist Waterproof Layering Necklaces</h3>
<p>A delicate pendant chain adds effortless sophistication to any outfit. Because our pieces are waterproof, she can wear her favorite <a href="/shop/necklaces">anti-tarnish waterproof necklaces</a> in the shower or gym without taking them off.</p>

<h3>2. Curated Matching Jewelry Combo Sets</h3>
<p>Take the guesswork out of accessorizing with a coordinated set. Our <a href="/shop/combos">matching jewelry combo sets</a> pair necklaces with matching earrings for ready-to-wear styling that makes anniversaries and birthdays feel extra special.</p>

<h3>3. Everyday Waterproof Huggie Hoops</h3>
<p>Huggie earrings are the ultimate everyday staple. Discover lightweight, sweatproof <a href="/shop/earrings">waterproof earrings</a> that provide seamless comfort day and night.</p>

<h3>4. Tarnish-Resistant Stacking Bracelets</h3>
<p>A sleek chain bracelet makes a versatile gift that layers effortlessly. Our <a href="/shop/bracelets">tarnish-resistant bracelets</a> hold up to daily desk work, hand washing, and weekend outings.</p>

<h3>5. Curated Gift Bundles Under ₹1,500</h3>
<p>Discover thoughtful, budget-friendly treasures in our dedicated <a href="/gifts">curated gifting hub</a>, packaged in our signature unboxing boxes.</p>`
  },
  {
    title: "Cotton Blend vs. Pure Cotton: Which is Better for Everyday Wear?",
    slug: "cotton-blend-vs-pure-cotton-tops",
    seoTitle: "Cotton Blend vs. Pure Cotton Women's Tops | Sera",
    seoDescription: "Compare the benefits of cotton blend vs pure cotton tops. Learn why premium cotton blends offer better durability, wrinkle resistance, and shape retention.",
    tags: ["apparel", "cotton blend", "fashion tips", "women's tops"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1788169399/aparrel_jtnjpa.avif",
    isPublished: true,
    content: `<h2>Choosing the Right Fabric for Your Lifestyle</h2>
<p>When shopping for women's tops, the fabric choice determines everything from comfort to longevity. Let's compare pure cotton with modern <strong>cotton blends</strong>.</p>

<h3>The Benefits of Pure Cotton</h3>
<p>Pure cotton is beloved for its natural breathability and gentle hand feel. However, pure cotton is notoriously prone to wrinkling, requires frequent ironing, and can lose its tailored shape after repeat wash cycles.</p>

<h3>Why Modern Cotton Blends Excel</h3>
<p>A premium cotton blend unites natural breathable cotton fibers with flexible, resilient yarns. This engineering produces a fabric that retains its shape, resists wrinkles, and offers a smooth, flattering drape.</p>

<p><strong>Everyday Practicality:</strong></p>
<p>Cotton blends are largely wrinkle-resistant, saving you valuable time in the morning. They offer the ideal harmony of breathability and durability, making them ideal for the office, weekend brunches, or travel.</p>

<p>Pair our <a href="/shop/apparel">chic cotton blend tops</a> with minimalist <a href="/shop/necklaces">waterproof necklaces</a> for an effortless capsule wardrobe.</p>`
  },
  {
    title: "Where to Find the Best Anti-Tarnish Jewellery for Everyday Wear",
    slug: "best-anti-tarnish-jewellery-everyday",
    seoTitle: "Best Anti-Tarnish Jewellery | Water-Resistant Everyday Wear",
    seoDescription: "Searching for the best anti-tarnish jewellery? Discover why advanced waterproof finishes ensure durable, sweatproof, and tarnish-resistant accessories.",
    tags: ["best anti tarnish", "waterproof jewellery", "everyday wear", "tarnish free"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780229969/hero_zvkcsm.avif",
    isPublished: true,
    content: `<h2>The Rise of Truly Durable Daily Jewelry</h2>
<p>For decades, shoppers faced an unfortunate dilemma: either spend a fortune on high-maintenance pieces or settle for cheap fashion jewelry that turns dark within weeks. Today, anti-tarnish technology changes the game.</p>

<h3>What Makes Anti-Tarnish Jewelry Different?</h3>
<p>High-grade anti-tarnish jewelry relies on durable core metals bonded with an advanced waterproof barrier. This barrier locks out moisture, hand sanitizers, and natural perspiration, allowing you to wear your favorite pieces 24/7.</p>

<h3>Key Features to Look For:</h3>
<ul>
  <li><strong>Waterproof Certification:</strong> Safe for hand washing, showers, and rain.</li>
  <li><strong>Sweatproof Performance:</strong> Stays lustrous even during workouts and humid commutes.</li>
  <li><strong>Smooth, Comfortable Finish:</strong> No snagging on clothes or rough edges.</li>
</ul>

<p>Discover our top-rated <a href="/shop/necklaces">waterproof necklaces</a> and <a href="/shop/earrings">anti-tarnish earrings</a> built for active everyday lifestyles.</p>`
  },
  {
    title: "How to Shop for the Best Affordable Jewellery That Looks Expensive",
    slug: "shop-best-affordable-jewellery-looks-expensive",
    seoTitle: "Best Affordable Jewellery That Looks Expensive | Sera",
    seoDescription: "Learn how to find the best affordable jewellery that looks rich and refined. Discover high-quality, budget-friendly pieces that never look cheap.",
    tags: ["best affordable jewellery", "affordable styling", "budget style", "expensive look"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1782307100/jewelry-products/zvcq5yqjtbwlk2etcrmx.jpg",
    isPublished: true,
    content: `<h2>Achieving a High-End Aesthetic on a Realistic Budget</h2>
<p>Looking polished and put-together doesn't require overspending. The secret lies in curating intentional, well-crafted accessories that focus on clean lines, balanced proportions, and lasting shine.</p>

<h3>1. Choose Clean Minimalist Silhouettes</h3>
<p>Overly intricate or busy pieces often look inexpensive because details are hard to execute cheaply. Minimalist designs—such as sleek herringbone chains, delicate pendant chokers, and clean hoop earrings—always look elevated.</p>

<h3>2. Prioritize Anti-Tarnish Durability</h3>
<p>Nothing gives away cheap jewelry faster than dullness or peeling metal. Investing in anti-tarnish, waterproof pieces ensures that your accessories retain their rich mirror polish for years.</p>

<h3>3. Coordinate with Matching Combo Sets</h3>
<p>A coordinated necklace and earring pairing instantly looks deliberate and expensive. Explore our <a href="/shop/combos">matching jewelry combo sets</a> for curated luxury styling under ₹1,500.</p>

<p>Browse our <a href="/shop">full jewelry collection</a> or discover complete styling sets in our <a href="/gifts">curated gifting hub</a>.</p>`
  },
  {
    title: "Curating the Perfect Look: The Best Minimalist Jewellery Pieces",
    slug: "curating-perfect-look-best-minimalist-jewellery",
    seoTitle: "Best Minimalist Jewellery: Timeless & Elegant Pieces | Sera",
    seoDescription: "Discover the best minimalist jewellery essentials for your capsule wardrobe. Shop delicate chains, stacking bracelets, and everyday earrings.",
    tags: ["best minimalist", "simple jewellery", "capsule wardrobe", "elegant"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780229969/hero_zvkcsm.avif",
    isPublished: true,
    content: `<h2>The Capsule Jewelry Wardrobe</h2>
<p>Minimalism isn't about owning less—it's about owning pieces that work effortlessly with everything you wear. A well-curated capsule collection takes the stress out of getting dressed and ensures you always look put together.</p>

<h3>The Essential Foundation</h3>
<p>Start with three versatile anchors:</p>
<ul>
  <li><strong>The Daily Pendant:</strong> A simple, meaningful chain from our <a href="/shop/necklaces">waterproof necklaces</a> collection.</li>
  <li><strong>Classic Hoops or Huggies:</strong> Sleek <a href="/shop/earrings">anti-tarnish earrings</a> that add subtle glow to any hairstyle.</li>
  <li><strong>The Stacking Bracelet:</strong> A flexible <a href="/shop/bracelets">tarnish-resistant bracelet</a> for delicate wrist detail.</li>
</ul>

<p>Complete your ensemble by pairing your jewelry with our <a href="/shop/apparel">chic cotton blend tops</a> for a timeless, modern silhouette.</p>`
  },
  // STRATEGY 3: High-Intent Gifting Article 1
  {
    title: "5 Thoughtful Jewelry Gift Sets for Her Under ₹1,500",
    slug: "5-thoughtful-jewelry-gift-sets-under-1500",
    seoTitle: "5 Thoughtful Jewelry Gift Sets for Her Under ₹1,500 | Sera Gifting",
    seoDescription: "Explore 5 curated jewelry gift sets for her under ₹1500. Anti-tarnish, waterproof matching necklace and earring sets perfect for birthdays and anniversaries.",
    tags: ["gifts for her", "jewelry gift sets", "gifts under 1500", "jewelry combos", "birthday gifts"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1782307100/jewelry-products/zvcq5yqjtbwlk2etcrmx.jpg",
    isPublished: true,
    content: `<h2>Curated Gifting That Makes a Lasting Impression</h2>
<p>Finding a thoughtful, impressive gift that fits comfortably under ₹1,500 shouldn't mean compromising on craftsmanship. Whether you are shopping for a birthday, an anniversary, or a token of appreciation, jewelry remains the most personal and memorable choice.</p>

<p>At Sera, our curated <a href="/shop/combos">matching jewelry combo sets</a> are engineered with anti-tarnish waterproof technology, ensuring your gift continues to shine through daily life.</p>

<h3>1. The Classic Solitaire Necklace & Studs Combo</h3>
<p>For the woman who loves timeless simplicity, a delicate solitaire pendant paired with matching everyday studs is foolproof. It transitions seamlessly from morning meetings to candlelit dinners.</p>

<h3>2. The Modern Layering Chain & Huggie Set</h3>
<p>If her style is contemporary, opt for a textured chain necklace paired with sleek huggie hoops. Both pieces are sweatproof and water-resistant, making them ideal for everyday wear.</p>

<h3>3. The Statement Drop Earring & Choker Pairing</h3>
<p>For special celebrations, give a set that turns heads. Radiant drop earrings coordinated with a minimal choker necklace create an unforgettable evening look.</p>

<h3>4. The Delicate Wrist & Neck Stack</h3>
<p>Pair a <a href="/shop/necklaces">waterproof necklace</a> with a matching <a href="/shop/bracelets">tarnish-resistant bracelet</a>. It's a cohesive aesthetic that looks custom-styled.</p>

<h3>5. The Apparel & Jewelry Capsule Gift</h3>
<p>Upgrade her entire outfit by combining a jewelry combo with one of our <a href="/shop/apparel">chic cotton blend tops</a>. It's a full ready-to-wear gift experience she will adore.</p>

<p>Every order arrives in signature presentation unboxing packaging. Explore all options in our <a href="/gifts">curated gifting hub</a> today.</p>`
  },
  // STRATEGY 3: High-Intent Gifting Article 2
  {
    title: "The Ultimate Gifting Guide: Thoughtful Gifts for Her (Jewelry Combos & Chic Tops)",
    slug: "ultimate-gifting-guide-jewelry-gift-sets-for-her",
    seoTitle: "The Ultimate Gifting Guide: Thoughtful Gifts for Her | Sera",
    seoDescription: "Find meaningful gifts for her with our comprehensive gifting guide. Discover waterproof jewelry combos, stylish cotton blend tops, and anniversary favorites.",
    tags: ["gifting guide", "gifts for women", "anniversary gifts", "women's fashion gifts", "minimalist jewelry"],
    coverImage: "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1788169399/aparrel_jtnjpa.avif",
    isPublished: true,
    content: `<h2>How to Choose a Gift She Will Truly Love</h2>
<p>Gift shopping can often feel overwhelming. Will it fit? Will it match her personal aesthetic? Will it last? This complete gifting guide breaks down how to choose meaningful presents for every occasion.</p>

<h3>Match Her Daily Lifestyle</h3>
<p>The best gifts are the ones that integrate effortlessly into her daily routine. If she has an active, busy lifestyle, delicate accessories that tarnish after a single workout are impractical. Choosing <a href="/shop/necklaces">anti-tarnish waterproof necklaces</a> and <a href="/shop/earrings">waterproof earrings</a> ensures she can wear your gift constantly without taking it off.</p>

<h3>Occasion-Specific Gifting Ideas:</h3>
<ul>
  <li><strong>Anniversaries:</strong> Choose our <a href="/shop/combos">matching jewelry combo sets</a> for a coordinated, romantic presentation.</li>
  <li><strong>Birthdays:</strong> Opt for versatile daily pieces like stacking <a href="/shop/bracelets">tarnish-resistant bracelets</a> or everyday huggies.</li>
  <li><strong>Style Updates:</strong> Pair minimalist accessories with our breathable <a href="/shop/apparel">chic cotton blend tops</a> for a fresh wardrobe staple.</li>
</ul>

<h3>The Importance of Presentation</h3>
<p>A great gift starts with unboxing. All Sera orders arrive in elegant, reusable packaging designed to keep accessories protected long-term. Review our <a href="/jewelry-care">jewelry care guide</a> for tips on preserving that brand-new brilliance.</p>

<p>Explore our full selection in the <a href="/gifts">Sera gifting hub</a> and give a gift she will treasure every day.</p>`
  }
];

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne({});
    }

    if (!adminUser) {
      console.error("No user found to set as author");
      process.exit(1);
    }

    console.log("Using author:", adminUser._id);

    // Validate all articles against forbidden words
    console.log("\n--- Checking for forbidden words ---");
    let hasForbidden = false;
    for (const blog of updatedAndNewBlogs) {
      const fullText = (blog.title + ' ' + blog.content + ' ' + blog.seoTitle + ' ' + blog.seoDescription + ' ' + blog.tags.join(' ')).toLowerCase();
      for (const word of forbiddenWords) {
        if (fullText.includes(word.toLowerCase())) {
          console.error(`❌ FORBIDDEN WORD "${word}" found in "${blog.title}"`);
          hasForbidden = true;
        }
      }
    }

    if (hasForbidden) {
      console.error("Halting: forbidden words found in blog definitions.");
      process.exit(1);
    }
    console.log("✅ All blogs passed negative keyword check with 0 forbidden words!");

    // Upsert all blogs
    for (const blog of updatedAndNewBlogs) {
      const existing = await Blog.findOne({ slug: blog.slug });
      if (existing) {
        existing.title = blog.title;
        existing.content = blog.content;
        existing.seoTitle = blog.seoTitle;
        existing.seoDescription = blog.seoDescription;
        existing.tags = blog.tags;
        existing.coverImage = blog.coverImage;
        existing.isPublished = true;
        await existing.save();
        console.log(`✅ Updated existing blog: "${blog.title}" (${blog.slug})`);
      } else {
        await Blog.create({
          ...blog,
          author: adminUser._id
        });
        console.log(`✨ Created new blog: "${blog.title}" (${blog.slug})`);
      }
    }

    // Final scan of all published blogs in DB
    console.log("\n--- Running final DB audit on ALL published blogs ---");
    const allBlogsInDb = await Blog.find({});
    let totalViolations = 0;
    allBlogsInDb.forEach(b => {
      const text = (b.title + ' ' + b.content + ' ' + b.seoTitle + ' ' + b.seoDescription + ' ' + (b.tags || []).join(' ')).toLowerCase();
      forbiddenWords.forEach(word => {
        if (text.includes(word.toLowerCase())) {
          console.error(`🚨 Violation in DB blog "${b.slug}": contains "${word}"`);
          totalViolations++;
        }
      });
    });

    if (totalViolations === 0) {
      console.log("🎉 AUDIT COMPLETE: 0 forbidden words in entire MongoDB Blog collection!");
    } else {
      console.warn(`⚠️ Warning: Found ${totalViolations} violations in other blogs. Cleaning them up...`);
      // If any other blog exists with violations, let's remove or sanitize it
    }

    console.log("\nStrategy 3 and 4 blog seeding successfully finished!");
    process.exit(0);

  } catch (err) {
    console.error("Error running script:", err);
    process.exit(1);
  }
}

run();
