const express = require('express');
const { login } = require('../../../controllers/userControllers/authcontroller/userLogin'); // Corrected path

const router = express.Router();

router.post('/', login);

module.exports = router;
