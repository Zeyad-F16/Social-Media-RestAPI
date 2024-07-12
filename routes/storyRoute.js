const express=require("express");

const router=express.Router();

const { createStoryController,
        getStoriesController
 } = require('../controllers/storyController');
const upload = require('../middlewares/uploadImageMiddleware');

router.post('/create/:userId' ,upload.single("image") ,  createStoryController);

router.get('/all/:userId' , getStoriesController);


module.exports=router;