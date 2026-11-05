
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

if (process.env.NODE_ENV !== 'test' && process.env.SMTP_USER) {
  transporter.verify((error) => {
    if (error) {
      console.warn('SMTP connection failed:', error.message);
      console.warn('Password reset emails will be logged to console instead.');
    } else {
      console.log('SMTP ready to send emails');
    }
  });
}

const sendResetCodeEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1976d2; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the verification code below to continue:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 25px; background: #f5f5f5; border-radius: 8px; color: #1976d2;">
            ${code}
          </span>
        </div>
        <p style="color: #d32f2f; font-weight: bold;">This code will expire in 60 seconds.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #757575; font-size: 12px; text-align: center;">Task Management System</p>
      </div>
    `,
    text: `Your password reset code is: ${code}\n\nThis code will expire in 60 seconds.`
  };

  const missingSmtp = !process.env.SMTP_USER || !process.env.SMTP_PASS;

  if (missingSmtp && process.env.NODE_ENV === 'production') {
    throw new Error('SMTP is not configured. Refusing to pretend the email was sent.');
  }

  if (missingSmtp) {
    console.log(`Password reset email to: ${to}`);
    console.log(`Reset Code: ${code}`);
    return { devMode: true };
  }

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendResetCodeEmail, transporter };