const express=require("express");

const router=express.Router();

const { createStoryController,
        getStoriesController,
        getUserStoriesController,
        deleteStoryController,
        deleteStoriesController,
 } = require('../controllers/storyController');
const upload = require('../middlewares/uploadImageMiddleware');

router.post('/create/:userId' ,upload.single("image") ,  createStoryController);
router.get('/all/:userId' , getStoriesController);
router.get('/user/:userId' , getUserStoriesController);
router.delete('/delete/:storyId' , deleteStoryController);
router.delete('/delete/user/:userId' , deleteStoriesController);


module.exports=router;