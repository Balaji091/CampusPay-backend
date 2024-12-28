const express =require('express');
const {adminLogin}=require('../../../controllers/adminControllers/authcontroller/adminLogin');
const router=express.Router();
router.post('/',adminLogin);
module.exports=router;
