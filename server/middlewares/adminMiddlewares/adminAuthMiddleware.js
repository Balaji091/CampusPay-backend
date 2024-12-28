const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
exports.adminAuthMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"Autherisation header is not found"});
    }
    const Token=authHeader.split(' ')[1];
    if(!Token){
        res.status(400).send({message:"Token is missing"});
    }
    try{
        const decoded=jwt.verify(Token,jwtSecret);
        req.user=decoded;
        next();
    }
    catch(e){
        console.log(e);
        res.status(500).send("internal server error");
    }

}