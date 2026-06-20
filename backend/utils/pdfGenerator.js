const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoiceBase64 = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData.toString('base64'));
      });

      const invoiceNo = order.invoiceNumber || `INV-${order._id.toString().slice(-8)}`;
      const invoiceDate = new Date(order.createdAt);
      const formatAmount = (value) => Number((Number(value || 0)).toFixed(1));

      const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'slogo.png');
      const hasLogo = fs.existsSync(logoPath);

      if (hasLogo) {
        doc.image(logoPath, 50, 45, { width: 50 });
      } else {
        doc.fillColor('#444444').fontSize(20).text('SERA', 50, 50);
      }

      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('INVOICE', 50, 50, { align: 'right' })
        .fontSize(10)
        .text(`Invoice Number: ${invoiceNo}`, { align: 'right' })
        .text(`Date: ${invoiceDate.toLocaleDateString()}`, { align: 'right' })
        .moveDown();

      doc
        .fillColor('#444444')
        .fontSize(12)
        .text('Bill To:', 50, 120)
        .fontSize(10)
        .text(order.user?.name || order.shippingAddress.name || 'Customer', 50, 135)
        .text(`${order.shippingAddress.street}`, 50, 150)
        .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`, 50, 165)
        .text(`${order.shippingAddress.country}`, 50, 180)
        .text(`Phone: ${order.shippingAddress.phone}`, 50, 195)
        .moveDown();

      let tableTop = 230;

      // Table Header
      doc.font('Helvetica-Bold');
      doc.rect(50, tableTop, 510, 20).fill('#f8f9fa');
      doc.fillColor('#444444');
      doc.text('Item', 60, tableTop + 5);
      doc.text('Price', 280, tableTop + 5, { width: 90, align: 'right' });
      doc.text('Qty', 370, tableTop + 5, { width: 90, align: 'right' });
      doc.text('Total', 460, tableTop + 5, { width: 90, align: 'right' });

      doc.font('Helvetica');
      let y = tableTop + 30;

      order.items.forEach((item) => {
        const itemPrice = formatAmount(item.price);
        const itemTotal = formatAmount(itemPrice * item.quantity);

        doc.text(item.product?.name || 'Product', 60, y, { width: 220 });
        doc.text(`Rs. ${itemPrice}`, 280, y, { width: 90, align: 'right' });
        doc.text(item.quantity.toString(), 370, y, { width: 90, align: 'right' });
        doc.text(`Rs. ${itemTotal}`, 460, y, { width: 90, align: 'right' });
        
        y += 20;
        doc.rect(50, y - 10, 510, 0.5).fill('#e9ecef');
      });

      y += 20;

      const subtotal = order.items.reduce((acc, item) => acc + (formatAmount(item.price) * item.quantity), 0);
      
      doc.font('Helvetica-Bold');
      doc.text('Subtotal:', 370, y, { width: 90, align: 'right' });
      doc.text(`Rs. ${formatAmount(subtotal)}`, 460, y, { width: 90, align: 'right' });
      y += 20;

      if (order.couponCode) {
        const discountAmount = subtotal - order.totalPrice;
        doc.fillColor('#ef4444');
        doc.text(`Discount (${order.couponCode}):`, 370, y, { width: 90, align: 'right' });
        doc.text(`-Rs. ${formatAmount(discountAmount)}`, 460, y, { width: 90, align: 'right' });
        doc.fillColor('#444444');
        y += 20;
      }

      doc.rect(370, y - 10, 180, 0.5).fill('#e9ecef');
      
      doc.fontSize(12);
      doc.text('Total:', 370, y, { width: 90, align: 'right' });
      doc.text(`Rs. ${formatAmount(order.totalPrice)}`, 460, y, { width: 90, align: 'right' });

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(
          'Thank you for shopping with Sera Jewels.',
          50,
          doc.y + 40,
          { align: 'center', width: 510 }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateInvoiceBase64 };
