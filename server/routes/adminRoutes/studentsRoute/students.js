const express=require('express');
const {adminAuthMiddleware}=require('../../../middlewares/adminMiddlewares/adminAuthMiddleware');
const {getStudents}=require('../../../controllers/adminControllers/studentscontroller/getStudents');
const { getStudentDetails } = require('../../../controllers/adminControllers/studentscontroller/getStudentDetails');
const router=express.Router();
router.get('/',adminAuthMiddleware,getStudents);
router.get('/:admissionnumber',adminAuthMiddleware,getStudentDetails)
module.exports=router;