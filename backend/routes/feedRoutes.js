const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// XML Generator Helper for Google Merchant Center (RSS 2.0)
const generateGoogleMerchantXML = (products) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>Sera Jewels</title>\n`;
  xml += `    <link>https://www.serastore.in</link>\n`;
  xml += `    <description>Premium Anti-Tarnish Minimalist Jewelry</description>\n`;

  products.forEach(product => {
    // Only include active products with a price and an image
    if (product.isActive && product.price > 0 && product.images && product.images.length > 0) {
      // Escape special characters for XML
      const escapeXML = (str) => {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;');
      };

      const title = escapeXML(product.name);
      // Use fallback description if missing
      const description = escapeXML(product.description || `Buy ${product.name} at Sera Jewels. Premium anti-tarnish jewelry.`);
      const link = `https://www.serastore.in/product/${product._id}`;
      // Google requires absolute image URLs
      let imageLink = product.images[0];
      if (!imageLink.startsWith('http')) {
        imageLink = `https://www.serastore.in${imageLink}`;
      }
      
      const price = `${product.price}.00 INR`;
      const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';

      xml += `    <item>\n`;
      xml += `      <g:id>${product._id}</g:id>\n`;
      xml += `      <g:title>${title}</g:title>\n`;
      xml += `      <g:description>${description}</g:description>\n`;
      xml += `      <g:link>${link}</g:link>\n`;
      xml += `      <g:image_link>${imageLink}</g:image_link>\n`;
      xml += `      <g:price>${price}</g:price>\n`;
      xml += `      <g:availability>${availability}</g:availability>\n`;
      xml += `      <g:condition>new</g:condition>\n`;
      // Google requires a brand for jewelry
      xml += `      <g:brand>Sera</g:brand>\n`; 
      // If we don't have GTIN/MPN, we set identifier_exists to false
      xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
      xml += `    </item>\n`;
    }
  });

  xml += `  </channel>\n`;
  xml += `</rss>\n`;
  return xml;
};

// Route: GET /api/feed/google-merchant
// Description: Returns an XML RSS feed of all active products formatted for Google Merchant Center
router.get('/google-merchant', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    const xmlData = generateGoogleMerchantXML(products);
    
    res.header('Content-Type', 'application/xml');
    res.send(xmlData);
  } catch (error) {
    console.error('Error generating Google Merchant XML feed:', error);
    res.status(500).send('Error generating feed');
  }
});

module.exports = router;
