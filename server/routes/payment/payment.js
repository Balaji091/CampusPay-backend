const express = require('express');
const pool = require('../../db/pool');
const authenticationCheck = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticationCheck, async (req, res) => {
    const {
        admissionnumber,
        courseyear,
        phaseid,
        transactionid,
        amountpaid,
        paymentdate,
        receiptpath
    } = req.body;

    // Validate input fields
    if (!admissionnumber || !courseyear || !phaseid || !transactionid || !amountpaid || !paymentdate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the AdmissionNumber exists in the Students table
        const studentCheckQuery = `SELECT 1 FROM Students WHERE AdmissionNumber = $1`;
        const studentCheckResult = await pool.query(studentCheckQuery, [admissionnumber]);

        if (studentCheckResult.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found with the provided AdmissionNumber' });
        }

        // Check if the PhaseID exists in the PaymentPhases table
        const phaseCheckQuery = `SELECT 1 FROM PaymentPhases WHERE PhaseID = $1`;
        const phaseCheckResult = await pool.query(phaseCheckQuery, [phaseid]);

        if (phaseCheckResult.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid PhaseID. Please provide a valid PhaseID' });
        }

        // Check for duplicate payments with the same AdmissionNumber, CourseYear, and PhaseID
        const duplicateCheckQuery = `
            SELECT 1 
            FROM Payments 
            WHERE AdmissionNumber = $1 AND CourseYear = $2 AND PhaseID = $3
        `;
        const duplicateCheckResult = await pool.query(duplicateCheckQuery, [
            admissionnumber,
            courseyear,
            phaseid
        ]);

        if (duplicateCheckResult.rowCount > 0) {
            return res.status(409).json({ message: 'Payment for this phase and course year has already been submitted' });
        }

        // Insert payment into the Payments table
        const insertPaymentQuery = `
            INSERT INTO Payments 
            (AdmissionNumber, CourseYear, PhaseID, TransactionID, AmountPaid, PaymentDate, ReceiptPath)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING PaymentID;
        `;
        const values = [
            admissionnumber,
            courseyear,
            phaseid,
            transactionid,
            amountpaid,
            paymentdate,
            receiptpath || null // Optional field for ReceiptPath
        ];

        const insertPaymentResult = await pool.query(insertPaymentQuery, values);

        return res.status(201).json({
            message: 'Payment inserted successfully',
            paymentId: insertPaymentResult.rows[0].paymentid
        });
    } catch (error) {
        console.error('Error inserting payment:', error);
        if (error.code === '23505') {
            // Handle unique constraint violation
            return res.status(409).json({ message: 'TransactionID already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;