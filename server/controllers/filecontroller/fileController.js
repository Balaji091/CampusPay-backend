const cloudinary = require('../../db/cloudinary');
const {postPayment}=require('../paymentcontroller/postPayment') // Import postPayment function

exports.uploadFile = async (req, res, next) => {
    try {
        const file = req.file; // Multer adds the file object to req

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        cloudinary.uploader.upload_stream(
            {   folder:"studentPhees",
                resource_type: 'auto' }, // Supports images, PDFs, etc.
            async (error, uploadedFile) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ message: 'File upload failed' });
                }

                // Attach the uploaded file URL to req for further processing
                req.fileUrl = uploadedFile.secure_url;
                console.log(req.fileUrl);

                // Call the postPayment function after successful upload
                return postPayment(req, res);
            }
        ).end(file.buffer); // Send file buffer to Cloudinary
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
