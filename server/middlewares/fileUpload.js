const multer = require('multer');

// Use memory storage to store files temporarily before uploading to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
