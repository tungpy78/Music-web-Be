// Thay thế code cũ của bạn bằng code này
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Thiết lập API Key cho SendGrid
// Tên biến này (SENDGRID_API_KEY) sẽ được thêm vào Render
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (!sendgridApiKey) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}
sgMail.setApiKey(sendgridApiKey);

export const sendMail = async (to: string, subject: string, html: string) => {
  const from = process.env.MAIL_USER;
  if (!from) {
    throw new Error('MAIL_USER environment variable is not set');
  }
  const msg = {
    to: to, // Email người nhận
    from: from, // Email bạn đã xác thực với SendGrid ở Bước 3
    subject: subject,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending mail with SendGrid:', error);

    // Dòng này giúp xem chi tiết lỗi từ SendGrid
    if (error) {
      console.error(error);
    }
    throw error;
  }
};