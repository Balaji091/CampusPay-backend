const cloudinary = require('../db/cloudinary');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file; // Multer adds the file object to req

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Supports images, PDFs, etc.
      (error, uploadedFile) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'File upload failed' });
        }

        // Send the uploaded file URL to the client
        res.status(200).json({
          message: 'File uploaded successfully',
          url: uploadedFile.secure_url,
        });
      }
    ).end(file.buffer); // Send file buffer to Cloudinary
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
