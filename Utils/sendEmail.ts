import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Tải file .env
dotenv.config();


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,          // hoặc 587
  secure: true,       // nếu dùng 465 -> true; nếu 587 -> false và thêm requireTLS
  auth: {
    user: process.env.MAIL_USER,      // email bạn dùng gửi mail
    pass: process.env.MAIL_PASSWORD,  // mật khẩu ứng dụng (app password)
  },
  // tuỳ chọn: tăng timeout nếu mạng chậm
  connectionTimeout: 15000,
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
