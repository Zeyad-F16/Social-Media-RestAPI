const express  = require('express');
const router = express.Router();
const {createPostController ,
 createPostWithImageController ,
  updatePostController ,
  getUserPostsController,
  getallPostsController,
  deletePostController}= require('../controllers/PostController');
const uploadImage= require('../middlewares/uploadImageMiddleware');    

// Create post
router.post("/create", createPostController );

// Create Post With image
router.post('/create/:userId', uploadImage.array("images",5) , createPostWithImageController);

// update post
router.put("/update/:postId", updatePostController);

// get all posts
router.get("/all/:userId", getallPostsController);

// get user posts
router.get("/user/:userId", getUserPostsController);

// delete post
router.delete("/delete/:postId", deletePostController);

module.exports = router;