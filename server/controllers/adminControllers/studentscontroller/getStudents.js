const pool = require('../../../db/pool');
require('dotenv').config();

exports.getStudents = async (req, res) => {
    try {
        const { username } = req.user;

        // Verify if the user is an admin
        const adminQuery = `SELECT * FROM admin WHERE username=$1`;
        const adminResult = await pool.query(adminQuery, [username]);
        if (adminResult.rowCount === 0) {
            return res.status(404).send("No admin found");
        }

        // Extract filters from query parameters
        const { branch, yearOfStudy, search } = req.query;

        // Build the query dynamically based on filters
        let studentsQuery = `SELECT name, email, phone, department, yearofstudy, admissionnumber FROM students`;
        const queryParams = [];
        const conditions = [];

        if (branch) {
            conditions.push(`department = $${queryParams.length + 1}`);
            queryParams.push(branch);
        }

        if (yearOfStudy) {
            conditions.push(`yearofstudy = $${queryParams.length + 1}`);
            queryParams.push(yearOfStudy);
        }

        if (search) {
            conditions.push(`(LOWER(name) LIKE $${queryParams.length + 1} OR admissionnumber LIKE $${queryParams.length + 1})`);
            queryParams.push(`%${search.toLowerCase()}%`);
        }

        // Add conditions to the query if any filters are present
        if (conditions.length > 0) {
            studentsQuery += ` WHERE ` + conditions.join(' AND ');
        }

        // Execute the query
        const studentResult = await pool.query(studentsQuery, queryParams);
        if (studentResult.rowCount === 0) {
            return res.status(404).send("No students found");
        }

        return res.status(200).send({ studentsList: studentResult.rows });
    } catch (e) {
        console.error(e);
        return res.status(500).send("Internal server error");
    }
};
