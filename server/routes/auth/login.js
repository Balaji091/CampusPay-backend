const express = require('express');
const { login } = require('../../controllers/authcontroller/login');


const router = express.Router();

router.post('/', login);

module.exports = router;
