const express = require('express');
const registerRouter = require('./auth/register');
const loginRouter = require('./auth/login');
const paymentRouter = require('./payment/payment');
const profileRouter=require('./profile/profile')
const router = express.Router();

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/payment', paymentRouter);
router.use('/profile',profileRouter);

module.exports = router;
