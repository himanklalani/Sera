import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use fetch to get products from API at build time
async function generateSitemap() {
  try {
    const apiUrl = process.env.VITE_API_URL || 'https://backend.serastore.in';
    console.log(`Generating sitemap using API: ${apiUrl}`);
    
    // Attempt to fetch from the live API during build
    // If it fails (e.g., build time network restrictions), we will create a fallback
    let products = [];
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      if (res.ok) {
        const data = await res.json();
        products = data.products || data;
      }
    } catch (e) {
      console.warn('Could not fetch products for sitemap during build. Using static routes only.');
    }

    const baseUrl = 'https://www.serastore.in';
    const dateStr = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${baseUrl}/faq</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/jewelry-care</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/materials</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
`;

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p._id) {
          sitemap += `  <url>
    <loc>${baseUrl}/product/${p._id}</loc>
    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString() : dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
        }
      });
    }

    sitemap += `</urlset>`;

    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully.');
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
}

generateSitemap();
