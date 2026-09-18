const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Blog = require('../models/Blog');

const escapeXML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select('_id name category images updatedAt');
    const blogs = await Blog.find({ isPublished: true }).select('slug title coverImage updatedAt');

    const baseUrl = 'https://www.serastore.in';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Core Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Category Landing Pages -->
  <url>
    <loc>${baseUrl}/shop/earrings</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop/necklaces</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop/bracelets</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop/combos</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop/apparel</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Discovery & Info Pages -->
  <url>
    <loc>${baseUrl}/gifts</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/jewelry-care</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/materials</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/size-guide</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/sustainability</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Legal Pages -->
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/returns</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Journal/Blog Hub -->
  <url>
    <loc>${baseUrl}/journal</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Dynamic Product Pages with Google Image XML -->
`;

    products.forEach((product) => {
      const isApparel = product.category?.toLowerCase() === 'apparel';
      const descriptor = isApparel ? "Chic Women's Apparel" : "Anti-Tarnish Waterproof Jewelry";
      const imageTitle = escapeXML(`${product.name} - ${descriptor} | Sera`);
      const caption = escapeXML(product.name);

      sitemap += `  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>\n`;

      if (Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach((imgUrl) => {
          if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
            sitemap += `    <image:image>
      <image:loc>${escapeXML(imgUrl)}</image:loc>
      <image:title>${imageTitle}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>\n`;
          }
        });
      }

      sitemap += `  </url>\n`;
    });

    sitemap += `  <!-- Dynamic Blog Pages -->\n`;
    
    blogs.forEach((blog) => {
      sitemap += `  <url>
    <loc>${baseUrl}/journal/${blog.slug}</loc>
    <lastmod>${new Date(blog.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>\n`;

      if (blog.coverImage && typeof blog.coverImage === 'string' && blog.coverImage.startsWith('http')) {
        sitemap += `    <image:image>
      <image:loc>${escapeXML(blog.coverImage)}</image:loc>
      <image:title>${escapeXML(blog.title)} | Sera Journal</image:title>
    </image:image>\n`;
      }

      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    res.status(500).end();
  }
});

module.exports = router;
