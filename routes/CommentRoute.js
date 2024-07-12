const express = require('express');
const router = express.Router();

const { createCommentController ,
    createCommentReplyController ,
          updateCommentController,
     updateReplyCommentController,
     getPostCommentsController }=require('../controllers/CommentController');

router.post('/create',createCommentController);
router.post('/create/reply/:commentId',createCommentReplyController);
router.put('/updateComment/:commentId',updateCommentController);
router.put('/update/:commentId/reply/:replyId',updateReplyCommentController);
router.get('/post/:postId',getPostCommentsController);

module.exports= router;