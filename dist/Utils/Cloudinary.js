"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.YOUR_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (fileBuffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
            if (error)
                return reject(error);
            if (result && result.secure_url)
                return resolve(result.secure_url);
            reject(new Error('Failed to upload file'));
        });
        uploadStream.end(fileBuffer);
    });
};
const Cloudinary = {
    uploadToCloudinary,
};
exports.default = Cloudinary;
