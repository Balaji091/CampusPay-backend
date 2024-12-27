const express = require('express');

const {register} = require('../../../controllers/userControllers/authcontroller/userRegister');


const router = express.Router();

router.post('/', register);

module.exports = router;
