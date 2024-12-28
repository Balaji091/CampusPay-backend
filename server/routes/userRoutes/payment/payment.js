const express=require('express')
const { getPaymentDetailsById } = require('../../../controllers/userControllers/paymentcontroller/getPaymentDetails');
const { getPayments } = require('../../../controllers/userControllers/paymentcontroller/getPayments');
const authMiddleware = require('../../../middlewares/userMiddlewares/authMiddleware');
const upload = require('../../../middlewares/userMiddlewares/fileUpload');
const { uploadFile } = require('../../../controllers/userControllers/filecontroller/fileController');
const { getPaymentsHistory } = require('../../../controllers/userControllers/paymentcontroller/getPaymentsHistory');
const router = express.Router();

// Define routes
router.post('/', authMiddleware, upload.single('file'), uploadFile);
router.get('/', authMiddleware, getPayments);
router.get('/history', authMiddleware, getPaymentsHistory);
router.get('/:paymentId', authMiddleware, getPaymentDetailsById);

module.exports = router;