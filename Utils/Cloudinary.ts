import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.YOUR_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer: Buffer, options: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        
        if (error) return reject(error);
        if (result && result.secure_url) return resolve(result.secure_url);
        reject(new Error('Failed to upload file'));
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const Cloudinary = {
  uploadToCloudinary,
};

export default Cloudinary;
