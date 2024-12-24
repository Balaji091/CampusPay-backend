const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db/pool');
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const selectUserQuery = 'SELECT * FROM students WHERE email = $1';
    const dbUser = await pool.query(selectUserQuery, [email]);

    if (dbUser.rows.length === 0) {
        return res.status(400).send('Invalid user');
    }

    const isMatchPassword = await bcrypt.compare(password, dbUser.rows[0].password);
    if (isMatchPassword) {
        const payload = { email: email };
        const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        res.json({ message: 'Login success', jwtToken: jwtToken });
    } else {
        res.status(400).send('Invalid password');
    }
});

module.exports = router;
