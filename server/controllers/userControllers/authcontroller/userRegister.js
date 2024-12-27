const bcrypt = require('bcrypt');
const pool = require('../../../db/pool');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, department, yearofstudy, admissionnumber, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const selectUserQuery = 'SELECT * FROM students WHERE admissionnumber = $1';
        const dbUser = await pool.query(selectUserQuery, [admissionnumber]);

        if (dbUser.rows.length === 0) {
            const createUserQuery = `
                INSERT INTO students (name, email, phone, department, yearofstudy, admissionnumber, password)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
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
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(400).json({ message: 'User already exists' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
