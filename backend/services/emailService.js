// services/emailService.js
const axios = require('axios');

// Verify API configuration
if (process.env.BREVO_API_KEY) {
  console.log('✅ Brevo API configured successfully');
} else {
  console.warn('⚠️ BREVO_API_KEY missing - Email sending disabled');
}

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const emailData = {
    sender: { 
      name: "Sera Jewelry", 
      email: process.env.SMTP_FROM 
    },
    to: [{ email: email }],
    subject: "Sera - Email Verification OTP",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #fdf2f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #c5a666 0%, #b09458 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 300;
            letter-spacing: 3px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .content h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .otp-box {
            background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
            border: 2px solid #c5a666;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            display: inline-block;
          }
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #c5a666;
            letter-spacing: 12px;
            margin: 0;
            font-family: 'Courier New', monospace;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 5px 0;
          }
          .note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            color: #856404;
            font-size: 14px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SERA</h1>
          </div>
          <div class="content">
            <h2>Welcome to Sera Jewelry! ✨</h2>
            <p>Thank you for registering with us. To complete your registration, please verify your email address using the OTP below:</p>
            
            <div class="otp-box">
              <p class="otp-code">${otp}</p>
            </div>
            
            <div class="note">
              <strong>⏱️ Important:</strong> This OTP is valid for <strong>10 minutes</strong> only. Please enter it on the registration page to verify your email.
            </div>
            
            <p style="margin-top: 30px; color: #999; font-size: 14px;">
              If you didn't request this verification, please ignore this email or contact our support team.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sera Jewelry. All rights reserved.</p>
            <p>Timeless elegance for every occasion.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });

    console.log('✅ OTP Email sent successfully:', response.data.messageId);
    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.response?.data || error.message);
    throw new Error('Failed to send OTP email');
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, otp) => {
  const emailData = {
    sender: { 
      name: "Sera Jewelry", 
      email: process.env.SMTP_FROM 
    },
    to: [{ email: email }],
    subject: "Sera - Password Reset Request",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #fdf2f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #c5a666 0%, #b09458 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 300;
            letter-spacing: 3px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .content h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .otp-box {
            background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
            border: 2px solid #c5a666;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            display: inline-block;
          }
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #c5a666;
            letter-spacing: 12px;
            margin: 0;
            font-family: 'Courier New', monospace;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SERA</h1>
            <p>JEWELRY</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Use the OTP below to reset it.</p>
            <div class="otp-box">
              <p class="otp-code">${otp}</p>
            </div>
            <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sera Jewelry. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });

    console.log('✅ Password reset email sent successfully:', response.data.messageId);
  } catch (error) {
    console.error('❌ Password reset email failed:', error.response?.data || error.message);
    throw new Error('Failed to send password reset email');
  }
};

// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (order, userEmail, pdfBase64) => {
  const emailData = {
    sender: { 
      name: "Sera Jewelry", 
      email: process.env.SMTP_FROM 
    },
    to: [{ email: userEmail }],
    subject: `Order Confirmation - Sera Jewels (#${order._id.toString().slice(-8)})`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #fdf2f8; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #c5a666 0%, #b09458 100%); padding: 30px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px; }
          .content { padding: 40px 30px; text-align: center; color: #333; }
          .content h2 { font-size: 22px; margin-bottom: 20px; }
          .content p { font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 14px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SERA</h1>
          </div>
          <div class="content">
            <h2>Thank You For Your Order! ✨</h2>
            <p>Hi there,</p>
            <p>We've successfully received your order <strong>#${order._id.toString().slice(-8)}</strong> and we are getting it ready for you!</p>
            <p>A copy of your official invoice is attached to this email for your records.</p>
            <p>We'll notify you as soon as your beautiful pieces are on their way.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sera Jewelry. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachment: [
      {
        content: pdfBase64,
        name: `Invoice-${order.invoiceNumber || order._id.toString().slice(-8)}.pdf`
      }
    ]
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });
    console.log('✅ Order Confirmation Email sent successfully:', response.data.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Order Confirmation Email failed:', error.response?.data || error.message);
  }
};

// Send Delivery & Review Email
const sendDeliveryReviewEmail = async (order, userEmail) => {
  // Generate product links
  let productLinksHtml = '';
  if (order.items && order.items.length > 0) {
    productLinksHtml = `
      <div style="margin: 30px 0; padding: 20px; background-color: #fdf2f8; border-radius: 8px; text-align: left;">
        <h3 style="color: #c5a666; font-size: 16px; margin-top: 0;">Review your specific pieces:</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${order.items.map(item => {
            if (!item.product) return '';
            const productId = item.product._id || item.product;
            const productName = item.name || 'Your Jewelry Piece';
            return `<li style="margin-bottom: 10px;">
              <a href="https://www.serastore.in/product/${productId}" style="color: #333; text-decoration: none; font-weight: bold; border-bottom: 1px solid #c5a666;">
                📝 Rate your ${productName}
              </a>
            </li>`;
          }).join('')}
        </ul>
      </div>
    `;
  }

  const emailData = {
    sender: { 
      name: "Sera Jewelry", 
      email: process.env.SMTP_FROM 
    },
    to: [{ email: userEmail }],
    subject: `Your Sera Order Has Arrived! ✨`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #fdf2f8; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #c5a666 0%, #b09458 100%); padding: 30px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px; }
          .content { padding: 40px 30px; text-align: center; color: #333; }
          .content h2 { font-size: 22px; margin-bottom: 20px; }
          .content p { font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #c5a666; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 8px; margin: 10px 0 20px 0; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 14px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SERA</h1>
          </div>
          <div class="content">
            <h2>Order Delivered!</h2>
            <p>We hope you’re loving your SERA piece ✨</p>
            <p>We always love seeing how our pieces become a part of your everyday moments. If you ever happen to style it, we’d absolutely love to see it, whether it’s a quick story or even a simple message to us on Instagram!</p>
            
            <p style="margin-top: 30px;">If you had a wonderful experience with us, it would mean the world if you could leave a quick review on our Google page:</p>
            <a href="https://g.page/r/CWm-XXHSpBV6EAI/review" class="btn">⭐ Review Us On Google</a>

            <p style="font-size: 14px; margin-top: 10px;">And also, along with that, if possible, please login and share a review on the product page too:</p>
            ${productLinksHtml}

            <p>Thank you for choosing Sera!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sera Jewelry. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });
    console.log('✅ Delivery Review Email sent successfully:', response.data.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Delivery Review Email failed:', error.response?.data || error.message);
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendDeliveryReviewEmail
};
