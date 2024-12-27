const express = require('express');
const registerRouter = require('./userRoutes/auth/userRegister');
const loginRouter = require('./userRoutes/auth/userLogin');
const paymentRouter = require('./userRoutes/payment/payment');
const profileRouter=require('./userRoutes/profile/profile')
const router = express.Router();

router.use('/user/register', registerRouter);
router.use('/user/login', loginRouter);
router.use('/user/payment', paymentRouter);
router.use('/user/profile',profileRouter);

module.exports = router;
