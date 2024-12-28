const jwt = require('jsonwebtoken');
const pool = require('../../../db/pool');
const bcrypt=require('bcrypt')
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
exports.adminLogin=async(req,res)=>{
    try{
        const{username,password}=req.body;
        const selectUser=`SELECT * FROM admin where username=$1 `;
        const dbAdmin=await pool.query(selectUser,[username]);
        if(dbAdmin.rows.length===0){
            res.send({message:"invlid user"});
        }
        const isMatchPassword=bcrypt.compare(password,dbAdmin.rows[0].password);
        if(isMatchPassword){
            const payload={username:username};
            const jwtToken=jwt.sign(payload,jwtSecret,{expiresIn:'1h'});
            res.json({message:"Login Success",jwtToken:jwtToken});
        }
        else{
            res.status(400).send("invalid password");
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send("internal server error");
    }
}