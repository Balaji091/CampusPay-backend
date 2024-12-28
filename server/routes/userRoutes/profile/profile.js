const express=require("express");
const authMiddleware = require('../../../middlewares/userMiddlewares/authMiddleware');
const {profileDetails}=require('../../../controllers/userControllers/profilecontroller/profile')
const router = express.Router();
router.get('/',authMiddleware,profileDetails);
module.exports=router