import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_HTML_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(BASE_HTML_PATH)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(BASE_HTML_PATH, 'utf-8');

const routes = [
  {
    path: '/gifts',
    title: 'Gifts For Her | Curated Jewelry Gifts & Bundles | Sera',
    description: 'Shop Sera for thoughtful gifts for her. Discover anti-tarnish waterproof jewelry gift sets, matching combos under ₹1500, chic tops, and anniversary gifts.',
    canonical: 'https://www.serastore.in/gifts',
    ogImage: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780230280/gift1_yugt68.avif'
  },
  {
    path: '/shop',
    title: 'Anti-Tarnish Waterproof Jewelry & Chic Women\'s Apparel | Sera Store',
    description: 'Explore Sera\'s collection of waterproof anti-tarnish jewelry, chic women\'s tops, matching jewelry combos, and curated gift boxes. Designed for effortless everyday wear.',
    canonical: 'https://www.serastore.in/shop'
  },
  {
    path: '/shop/bracelets',
    title: 'Waterproof Anti-Tarnish Bracelets & Cuffs | Sera',
    description: 'Stack and style with durable, waterproof bracelets and cuffs. Sweatproof and tarnish-resistant for all-day wear.',
    canonical: 'https://www.serastore.in/shop/bracelets'
  },
  {
    path: '/shop/apparel',
    title: 'Chic Women\'s Tops & Breathable Cotton Blend Apparel | Sera',
    description: 'Shop chic women\'s tops and everyday clothes crafted from breathable, premium cotton blend fabrics. Effortless silhouettes designed for daily comfort and timeless grace.',
    canonical: 'https://www.serastore.in/shop/apparel'
  },
  {
    path: '/shop/necklaces',
    title: 'Anti-Tarnish Waterproof Necklaces & Pendants | Sera',
    description: 'Discover elegant anti-tarnish necklaces, dainty pendants, and layered chains. Waterproof and sweatproof, crafted for daily wear without fading.',
    canonical: 'https://www.serastore.in/shop/necklaces'
  },
  {
    path: '/shop/earrings',
    title: 'Waterproof Anti-Tarnish Earrings, Hoops & Studs | Sera',
    description: 'Shop lightweight waterproof earrings made for everyday wear. From classic hoops to delicate studs and drop earrings, find your signature pair.',
    canonical: 'https://www.serastore.in/shop/earrings'
  },
  {
    path: '/shop/combos',
    title: 'Curated Jewelry Combo Sets & Gift Bundles | Sera',
    description: 'Curated matching jewelry combo sets and bundles. Beautifully paired necklaces, earrings, and bracelets at bundle savings—perfect gifts for her.',
    canonical: 'https://www.serastore.in/shop/combos'
  },
  {
    path: '/about',
    title: 'About Us | Sera',
    description: 'Discover the story of Sera Jewels, where timeless elegance meets modern intention in premium anti-tarnish jewelry.',
    canonical: 'https://www.serastore.in/about'
  },
  {
    path: '/faq',
    title: 'Frequently Asked Questions | Sera',
    description: 'Find answers to your questions about Sera\'s anti-tarnish jewelry, shipping, returns, and how to care for waterproof rings and necklaces.',
    canonical: 'https://www.serastore.in/faq'
  },
  {
    path: '/jewelry-care',
    title: 'Jewelry Care Guide | Sera',
    description: 'Learn how to care for your anti-tarnish waterproof jewelry to ensure long-lasting brilliance and shine.',
    canonical: 'https://www.serastore.in/jewelry-care'
  },
  {
    path: '/materials',
    title: 'Our Materials & Quality | Sera Jewelry & Apparel',
    description: 'Learn about the premium anti-tarnish materials and breathable cotton blends used to craft Sera jewelry and apparel.',
    canonical: 'https://www.serastore.in/materials'
  },
  {
    path: '/size-guide',
    title: 'Size & Fit Guide | Free Size Jewelry & Apparel Sizing | Sera',
    description: 'Comprehensive Sera sizing guide: All jewelry and accessories are Anti-Tarnish, Waterproof, and Free Size (universal fit for all). Apparel available in XS, S, M, L.',
    canonical: 'https://www.serastore.in/size-guide'
  },
  {
    path: '/sustainability',
    title: 'Sustainability & Conscious Craft | Sera',
    description: 'Explore Sera\'s commitment to sustainable jewelry practices, minimal waste, and ethical craftsmanship.',
    canonical: 'https://www.serastore.in/sustainability'
  },
  {
    path: '/journal',
    title: 'The Journal | Style Guides, Jewelry Care & Trends | Sera',
    description: 'Discover the latest trends, styling guides, and news from Sera. Read our articles on affordable luxury, anti-tarnish jewelry, and everyday elegance.',
    canonical: 'https://www.serastore.in/journal'
  },
  {
    path: '/returns',
    title: 'Returns & Exchanges Policy | Sera',
    description: 'Learn about Sera\'s transparent exchange policy and customer guarantees.',
    canonical: 'https://www.serastore.in/returns'
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Sera',
    description: 'Read Sera\'s privacy policy and data security practices.',
    canonical: 'https://www.serastore.in/privacy-policy'
  },
  {
    path: '/terms',
    title: 'Terms of Service | Sera',
    description: 'Read Sera\'s terms of service and purchase agreements.',
    canonical: 'https://www.serastore.in/terms'
  },
  {
    path: '/contact',
    title: 'Contact Us | Sera Jewels',
    description: 'Have a question, custom request, or need help with an order? Contact the Sera team today.',
    canonical: 'https://www.serastore.in/contact'
  },
  {
    path: '/sitemap',
    title: 'Sitemap | Sera Jewels',
    description: 'Navigate Sera Jewels. Find all our collections, products, guides, and policies in one place.',
    canonical: 'https://www.serastore.in/sitemap'
  }
];

console.log(`[SEO Prerender] Generating dedicated static HTML shells for ${routes.length} canonical routes...`);

routes.forEach((route) => {
  let html = baseHtml;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta name="description" content="[\s\S]*?" \/>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace or inject Canonical Link
  if (/<link rel="canonical"[\s\S]*?>/i.test(html)) {
    html = html.replace(/<link rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${route.canonical}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${route.canonical}" />\n  </head>`);
  }

  // Replace OpenGraph Title & Description
  html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/i, `<meta property="og:url" content="${route.canonical}" />`);

  if (route.ogImage) {
    html = html.replace(/<meta property="og:image" content="[\s\S]*?" \/>/i, `<meta property="og:image" content="${route.ogImage}" />`);
    html = html.replace(/<meta name="twitter:image" content="[\s\S]*?" \/>/i, `<meta name="twitter:image" content="${route.ogImage}" />`);
  }

  // Replace Twitter Title & Description
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`);

  // Determine output directory
  const relativePath = route.path.replace(/^\//, '');
  const outDir = path.join(DIST_DIR, relativePath);
  fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, 'index.html');
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log(`[SEO Prerender] Wrote: ${outFile} -> canonical: ${route.canonical}`);
});

console.log('[SEO Prerender] Completed successfully! All canonical routes have pre-baked HTML shells.');
