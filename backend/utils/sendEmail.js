const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // email not configured; skip silently
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

const sendEnquiryNotification = async (enquiry) => {
  const t = getTransporter();
  if (!t) {
    console.log('SMTP not configured — skipping enquiry email notification.');
    return;
  }
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#FF6B1A;">New Product Enquiry</h2>
      <table cellpadding="8" style="border-collapse: collapse; width: 100%;">
        <tr><td style="font-weight:bold;">Product</td><td>${enquiry.productName}</td></tr>
        <tr><td style="font-weight:bold;">Name</td><td>${enquiry.name}</td></tr>
        <tr><td style="font-weight:bold;">Email</td><td>${enquiry.email}</td></tr>
        <tr><td style="font-weight:bold;">Phone</td><td>${enquiry.phone}</td></tr>
        <tr><td style="font-weight:bold;">Company</td><td>${enquiry.companyName}</td></tr>
        <tr><td style="font-weight:bold;">Message</td><td>${enquiry.message || '—'}</td></tr>
      </table>
      <p style="color:#777; font-size:12px; margin-top:16px;">Received ${new Date(
        enquiry.createdAt || Date.now()
      ).toLocaleString()}</p>
    </div>
  `;

  try {
    await t.sendMail({
      from: `"Website Enquiries" <${process.env.SMTP_USER}>`,
      to,
      subject: `New Enquiry: ${enquiry.productName} — ${enquiry.name}`,
      html,
    });
  } catch (err) {
    // Don't fail the request if email fails; just log it.
    console.error('Failed to send enquiry notification email:', err.message);
  }
};

module.exports = { sendEnquiryNotification };
