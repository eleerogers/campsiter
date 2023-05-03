import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'eleerogers',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => {
    return {
      folder: 'assets',
      allowedFormats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 300, height: 300, crop: 'limit' }]
    }
  }
});

const parser = multer({ storage });

export default parser;
