import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Tải file .env
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail', // hoặc smtp server khác
  auth: {
    user: process.env.MAIL_USER,      // email bạn dùng gửi mail
    pass: process.env.MAIL_PASSWORD,  // mật khẩu ứng dụng (app password)
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending mail:', error);
    throw error;
  }
};
