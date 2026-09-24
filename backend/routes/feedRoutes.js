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
  xml += `    <description>Premium Anti-Tarnish Waterproof Jewelry &amp; Women's Chic Apparel</description>\n`;

  products.forEach((product) => {
    // Only include active products with a price and at least one image
    if (product.isActive && product.price > 0 && product.images && product.images.length > 0) {
      // Escape special characters for XML
      const escapeXML = (str) => {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      const isApparel = product.category?.toLowerCase() === 'apparel';
      const title = escapeXML(product.name);
      const defaultDesc = isApparel
        ? `Shop ${product.name} at Sera. Chic, breathable cotton blend women's top designed for everyday comfort.`
        : `Buy ${product.name} at Sera. Premium anti-tarnish, waterproof everyday jewelry.`;

      const description = escapeXML(product.description || defaultDesc);
      const link = `https://www.serastore.in/product/${product._id}`;

      // Google requires absolute image URLs
      let primaryImage = product.images[0];
      if (!primaryImage.startsWith('http')) {
        primaryImage = `https://www.serastore.in${primaryImage}`;
      }

      const price = `${Number(product.price).toFixed(2)} INR`;
      const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';
      const productType = isApparel
        ? 'Apparel &amp; Accessories &gt; Clothing &gt; Tops'
        : 'Apparel &amp; Accessories &gt; Jewelry';
      const googleCategory = isApparel ? '212' : '188';
      const shippingPrice = product.price > 999 ? '0.00' : '100.00';

      xml += `    <item>\n`;
      xml += `      <g:id>${product._id}</g:id>\n`;
      xml += `      <g:title>${title}</g:title>\n`;
      xml += `      <g:description>${description}</g:description>\n`;
      xml += `      <g:link>${link}</g:link>\n`;
      xml += `      <g:image_link>${escapeXML(primaryImage)}</g:image_link>\n`;

      // Additional images for Google Shopping image carousels
      if (product.images.length > 1) {
        product.images.slice(1, 10).forEach((extraImg) => {
          let extraUrl = extraImg;
          if (!extraUrl.startsWith('http')) {
            extraUrl = `https://www.serastore.in${extraUrl}`;
          }
          xml += `      <g:additional_image_link>${escapeXML(extraUrl)}</g:additional_image_link>\n`;
        });
      }

      // Shipping block FIRST — GMC reads in document order; having shipping before price
      // helps the crawler associate delivery cost before rendering the price field.
      xml += `      <g:shipping>\n`;
      xml += `        <g:country>IN</g:country>\n`;
      xml += `        <g:service>${isApparel ? 'Custom Stitched Apparel Delivery' : 'Standard Delivery'}</g:service>\n`;
      xml += `        <g:price>${shippingPrice} INR</g:price>\n`;
      xml += `        <g:min_handling_time>${isApparel ? 5 : 2}</g:min_handling_time>\n`;
      xml += `        <g:max_handling_time>${isApparel ? 7 : 3}</g:max_handling_time>\n`;
      xml += `        <g:min_transit_time>5</g:min_transit_time>\n`;
      xml += `        <g:max_transit_time>${isApparel ? 7 : 5}</g:max_transit_time>\n`;
      xml += `      </g:shipping>\n`;

      xml += `      <g:price>${price}</g:price>\n`;
      xml += `      <g:availability>${availability}</g:availability>\n`;
      xml += `      <g:condition>new</g:condition>\n`;
      xml += `      <g:brand>Sera</g:brand>\n`;
      xml += `      <g:product_type>${productType}</g:product_type>\n`;
      xml += `      <g:google_product_category>${googleCategory}</g:google_product_category>\n`;
      xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
      xml += `      <g:gender>female</g:gender>\n`;
      xml += `      <g:age_group>adult</g:age_group>\n`;
      xml += `      <g:shipping_label>${isApparel ? 'apparel' : 'jewelry'}</g:shipping_label>\n`;
      xml += `      <g:transit_time_label>${isApparel ? 'custom-stitched' : 'standard'}</g:transit_time_label>\n`;
      xml += `      <g:min_handling_time>${isApparel ? 5 : 2}</g:min_handling_time>\n`;
      xml += `      <g:max_handling_time>${isApparel ? 7 : 3}</g:max_handling_time>\n`;
      xml += `      <g:custom_label_0>${isApparel ? 'apparel' : 'jewelry'}</g:custom_label_0>\n`;
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
    const products = await Product.find({
      isActive: true,
      isAddon: { $ne: true },
      category: { $nin: ['add-on', 'addon'] }
    });
    const xmlData = generateGoogleMerchantXML(products);

    res.header('Content-Type', 'application/xml');
    res.send(xmlData);
  } catch (error) {
    console.error('Error generating Google Merchant XML feed:', error);
    res.status(500).send('Error generating feed');
  }
});

module.exports = router;
