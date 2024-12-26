// paymentHistory.js

const pool = require('../../db/pool');
require('dotenv').config();

exports.getPaymentsHistory = async (req, res) => {
    try {
        const { email } = req.user;
        const { searchQuery } = req.query;

        console.log('User:', email);
        console.log('Query Parameters:', req.query);

        const studentQuery = 'SELECT admissionnumber FROM students WHERE email = $1';
        const studentResult = await pool.query(studentQuery, [email]);

        if (studentResult.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const admissionnumber = studentResult.rows[0].admissionnumber;

        let paymentsQuery = `
            SELECT  
                p.CourseYear,
                pp.PhaseName,
                p.submitteddate,
                p.verifiedstatus  
            FROM 
                Payments AS p
            INNER JOIN 
                PaymentPhases AS pp
            ON 
                p.PhaseID = pp.PhaseID
            WHERE 
                p.AdmissionNumber = $1
        `;
        const queryParams = [admissionnumber];

        if (searchQuery) {
            queryParams.push(`%${searchQuery}%`);
            paymentsQuery += ` AND CONCAT(pp.PhaseName, ' ', p.CourseYear) ILIKE $${queryParams.length}`;
        }

        console.log('Query Params:', queryParams);
        console.log('Payments Query:', paymentsQuery);

        const paymentsResult = await pool.query(paymentsQuery, queryParams);

        if (paymentsResult.rowCount === 0) {
            return res.status(404).json({ message: 'No payment records found' });
        }

        return res.status(200).json({ 
            payments: paymentsResult.rows})
        
    } catch (error) {
        console.error('Error fetching payment details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
