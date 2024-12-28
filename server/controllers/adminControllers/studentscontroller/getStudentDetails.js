const pool = require('../../../db/pool');
require('dotenv').config();
exports.getStudentDetails=async(req,res)=>{
    try{
        const{username}=req.user;
        // Verify if the user is an admin
        const adminQuery = `SELECT * FROM admin WHERE username=$1`;
        const adminResult = await pool.query(adminQuery, [username]);
        if (adminResult.rowCount === 0) {
            return res.status(404).send("No admin found");
        }
        const {admissionnumber}=req.params;
        const profileQuery = `
            SELECT name, email, phone, department, yearofstudy, admissionnumber
            FROM students
            WHERE admissionnumber = $1
            `;
            const profileResult = await pool.query(profileQuery, [admissionnumber]);
            if (profileResult.rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
            }
            const profileDetails = profileResult.rows[0];

            // 2. Fetch Payment Details
            const paymentDetailsQuery = `
            SELECT 
                pp.phasename, 
                p.courseyear, 
                p.transactionid, 
                p.submitteddate, 
                p.receiptpath, 
                p.amountpaid, 
                p.paymentdate
            FROM payments p
            JOIN paymentphases pp ON p.phaseid = pp.phaseid
            WHERE p.admissionnumber = $1 AND p.verifiedstatus = 'Accepted'
            `;
            const paymentDetailsResult = await pool.query(paymentDetailsQuery, [admissionnumber]);
            const paymentDetails = paymentDetailsResult.rows;

            // 3. Fetch History Details
            const historyDetailsQuery = `
            SELECT 
                p.courseyear, 
                pp.phasename, 
                p.verifiedstatus, 
                p.submitteddate
            FROM payments p
            JOIN paymentphases pp ON p.phaseid = pp.phaseid
            WHERE p.admissionnumber = $1
            ORDER BY p.submitteddate
            `;
            const historyDetailsResult = await pool.query(historyDetailsQuery, [admissionnumber]);
            const historyDetails = historyDetailsResult.rows;

            // Combine all results into a single object
            const response = {
            profileDetails,
            paymentDetails,
            historyDetails,
            };

            return res.status(200).json(response);

            }
    catch(e){
        console.log(e);
        res.status(500).send("internal server error");
    }
    

}