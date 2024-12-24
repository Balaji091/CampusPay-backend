const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../db/pool');

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, phone, department, yearofstudy, admissionnumber, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectUserQuery = 'SELECT * FROM students WHERE admissionnumber = $1';
    const dbUser = await pool.query(selectUserQuery, [admissionnumber]);

    const app = express();

    if (dbUser.rows.length === 0) {
        const createUserQuery = `
            INSERT INTO students (name, email, phone, department, yearofstudy, admissionnumber, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(createUserQuery, [
            name,
            email,
            phone,
            department,
            yearofstudy,
            admissionnumber,
            hashedPassword,
        ]);
        res.status(201).send('User created successfully');
    } else {
        res.status(400).send('User already exists');
    }
});

module.exports = router;
