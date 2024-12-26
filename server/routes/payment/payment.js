const express = require('express');
const { postPayment} = require('../../controllers/paymentcontroller/postPayment');
const {  getPaymentDetailsById } = require('../../controllers/paymentcontroller/getPaymentDetails');
const {  getPayments  } = require('../../controllers/paymentcontroller/getPayments');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

// Define routes
router.post('/', authMiddleware, postPayment);
router.get('/', authMiddleware, getPayments);
router.get('/:paymentId', authMiddleware, getPaymentDetailsById);

module.exports = router;
