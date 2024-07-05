const express = require('express');
const router = express.Router();

const { createCommentController }=require('../controllers/CommentController');

router.post('/create',createCommentController);

module.exports= router;