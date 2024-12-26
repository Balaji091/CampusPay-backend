
const pool = require('../../db/pool');
require('dotenv').config();
exports.getPaymentDetailsById = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { email } = req.user; // Extract user's admission number
        const studentQuery = 'SELECT admissionnumber FROM students WHERE email = $1';
        const studentResult = await pool.query(studentQuery, [email]);

        if (studentResult.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const admissionnumber = studentResult.rows[0].admissionnumber;

        // Validate paymentId
        if (!paymentId || isNaN(paymentId)) {
            return res.status(400).json({ message: 'Invalid payment ID' });
        }

        // SQL Query to fetch payment details by paymentId
        const selectPayment = `
            SELECT * 
            FROM payments 
            WHERE paymentid = $1 AND admissionnumber = $2
        `;
        const paymentResult = await pool.query(selectPayment, [paymentId,admissionnumber]);

        if (paymentResult.rowCount === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

       res.status(200).send({paymentDetails:paymentResult.rows})
    } catch (e) {
        console.error('Error fetching payment details:', e.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
