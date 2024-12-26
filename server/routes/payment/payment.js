const express = require('express');
const { postPayment} = require('../../controllers/paymentcontroller/postPayment');
const {  getPaymentDetailsById } = require('../../controllers/paymentcontroller/getPaymentDetails');
const {  getPayments  } = require('../../controllers/paymentcontroller/getPayments');
const authMiddleware = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/fileUpload');
const { uploadFile } = require('../../controllers/filecontroller/fileController');

const router = express.Router();

// Define routes
router.post('/',authMiddleware,upload.single('file'),uploadFile);
router.get('/', authMiddleware, getPayments);
router.get('/:paymentId', authMiddleware, getPaymentDetailsById);
module.exports = router;
