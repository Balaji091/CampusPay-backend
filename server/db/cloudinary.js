const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUD_API_SECRET, // Cloudinary API secret
});

module.exports = cloudinary;
