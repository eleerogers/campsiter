const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'eleerogers',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'assets',
  allowedFormats: ['jpg', 'jpeg', 'png'],
  transformation: [{ width: 300, height: 300, crop: 'limit' }]
});

const parser = multer({ storage });

module.exports = parser;
