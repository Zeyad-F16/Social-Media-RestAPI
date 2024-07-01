const express  = require('express');
const router = express.Router();
const {createPostController}= require('../controllers/PostController');

// Create post
router.post("/create", createPostController );

module.exports = router;