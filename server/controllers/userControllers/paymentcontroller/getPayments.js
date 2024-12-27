const pool = require('../../../db/pool');
require('dotenv').config();

exports.getPayments = async (req, res) => {
    try {
        const { email } = req.user; // Extract user email
        const { searchQuery, paymentType, courseYear } = req.query; // Extract query parameters

        // Step 1: Get AdmissionNumber for the user
        const studentQuery = 'SELECT admissionnumber FROM students WHERE email = $1';
        const studentResult = await pool.query(studentQuery, [email]);

        if (studentResult.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const admissionnumber = studentResult.rows[0].admissionnumber;

        // Step 2: Build the base query and parameters
        let paymentsQuery = `
            SELECT  
                p.paymentid, 
                p.CourseYear,
                pp.PhaseName,
                pp.PaymentType   
            FROM 
                Payments AS p
            INNER JOIN 
                PaymentPhases AS pp
            ON 
                p.PhaseID = pp.PhaseID
            WHERE 
                p.AdmissionNumber = $1 AND p.verifiedstatus='Accepted'
        `;
        const queryParams = [admissionnumber];

        // Step 3: Add filters dynamically
        if (searchQuery) {
            queryParams.push(`%${searchQuery}%`);
            paymentsQuery += ` AND CONCAT(pp.PhaseName, ' ', p.CourseYear) ILIKE $${queryParams.length}`;
        }

        if (paymentType) {
            queryParams.push(paymentType);
            paymentsQuery += ` AND pp.PaymentType = $${queryParams.length}`;
        }

        if (courseYear) {
            queryParams.push(courseYear);
            paymentsQuery += ` AND p.CourseYear = $${queryParams.length}`;
        }

        // Step 4: Execute the query
        const paymentsResult = await pool.query(paymentsQuery, queryParams);

        if (paymentsResult.rowCount === 0) {
            return res.status(404).json({ message: 'No payment records found' });
        }

        // Step 5: Return the result with payment IDs
        return res.status(200).json({ 
            payments: paymentsResult.rows.map(payment => ({
                paymentId: payment.paymentid,
                courseYear: payment.courseyear,
                phaseName: payment.phasename,
                paymentType: payment.paymenttype
            }))
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
