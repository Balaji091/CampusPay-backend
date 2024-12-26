const pool = require('../../db/pool');
require('dotenv').config();

exports.postPayment = async (req, res) => {
    try {
        const { email } = req.user; 
        const receiptUrl=req.fileUrl// Extract the email from the decoded token
        console.log('User Email:', email); // Log the email for debugging

        // Step 2: Check if the user exists and fetch admissionnumber
        const userCheckQuery = 'SELECT admissionnumber FROM students WHERE email = $1';
        const userCheckResult = await pool.query(userCheckQuery, [email]);

        if (userCheckResult.rowCount === 0) {
            return res.status(404).json({ message: 'User not found with the provided email' });
        }

        const admissionnumber = userCheckResult.rows[0].admissionnumber;

        // Extract other payment details from the request body
        const { courseyear, phaseid, transactionid, amountpaid, paymentdate } = req.body;
       // Use the URL from the upload function

        if (!courseyear || !phaseid || !transactionid || !amountpaid || !paymentdate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Step 3: Check if student exists using admissionnumber
        const studentCheckQuery = 'SELECT 1 FROM students WHERE admissionnumber = $1';
        const studentCheckResult = await pool.query(studentCheckQuery, [admissionnumber]);

        if (studentCheckResult.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found with the provided AdmissionNumber' });
        }

        // Step 4: Check if phase exists
        const phaseCheckQuery = 'SELECT 1 FROM paymentphases WHERE phaseid = $1';
        const phaseCheckResult = await pool.query(phaseCheckQuery, [phaseid]);

        if (phaseCheckResult.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid PhaseID. Please provide a valid PhaseID' });
        }

        // Step 5: Check for duplicate payment submission
        const duplicateCheckQuery = `
            SELECT 1 
            FROM payments 
            WHERE admissionnumber = $1 AND courseyear = $2 AND phaseid = $3
        `;
        const duplicateCheckResult = await pool.query(duplicateCheckQuery, [
            admissionnumber,
            courseyear,
            phaseid,
        ]);

        if (duplicateCheckResult.rowCount > 0) {
            return res.status(409).json({ message: 'Payment for this phase and course year has already been submitted' });
        }

        // Step 6: Insert the payment details into the database
        const submitteddate=new Date();
        const insertPaymentQuery = `
            INSERT INTO payments 
            (admissionnumber, courseyear, phaseid, transactionid, amountpaid, paymentdate, receiptpath,submitteddate)
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
            RETURNING paymentid;
        `;
        const values = [
            admissionnumber,
            courseyear,
            phaseid,
            transactionid,
            amountpaid,
            paymentdate,
            receiptUrl|| null,
            submitteddate
        ];

        const insertPaymentResult = await pool.query(insertPaymentQuery, values);

        return res.status(201).json({
            message: 'Payment inserted successfully',
            paymentId: insertPaymentResult.rows[0].paymentid,
        });
    } catch (error) {
        console.error('Error inserting payment:', error.message);
        console.error(error.stack); // Logs the stack trace for more details
        res.status(500).json({ message: 'Internal server error' });
    }
};
