const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../../db/pool');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const selectUserQuery = 'SELECT * FROM students WHERE email = $1';
        const dbUser = await pool.query(selectUserQuery, [email]);

        if (dbUser.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid user' });
        }

        const isMatchPassword = await bcrypt.compare(password, dbUser.rows[0].password);
        if (isMatchPassword) {
            const payload = { email: email };
            const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
            res.json({ message: 'Login success', jwtToken: jwtToken });
        } else {
            res.status(400).json({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
