const express = require('express');

const { register } = require('../../controllers/authcontroller/register');

const router = express.Router();

router.post('/', register);

module.exports = router;
