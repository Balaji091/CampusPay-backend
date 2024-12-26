const pool = require('../../db/pool');
require('dotenv').config();
exports.profileDetails=async(req,res)=>{
    try{
        const {email}=req.user;
        const profileQuery=`select * from students where email=$1`;
        const dbUser=await pool.query(profileQuery,[email]);
        if(dbUser.rows===0){
            res.status(400).send("user not found");
        }
        res.send({profileInfo:dbUser.rows})
    }
    catch(e){
        console.log(e)
    }
}