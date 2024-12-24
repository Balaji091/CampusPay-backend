const express = require('express');
const registerRouter = require('./auth/register');
const loginRouter = require('./auth/login');
const paymentRouter = require('./payment/payment');

const router = express.Router();

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/payment', paymentRouter);

module.exports = router;
