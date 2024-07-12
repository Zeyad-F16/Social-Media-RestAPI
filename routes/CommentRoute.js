const express = require('express');
const router = express.Router();

const { createCommentController ,
    createCommentReplyController ,
          updateCommentController,
     updateReplyCommentController,
     getPostCommentsController,
     deleteCommentController,
     deleteReplyCommentController }=require('../controllers/CommentController');

router.post('/create',createCommentController);
router.post('/create/reply/:commentId',createCommentReplyController);
router.put('/updateComment/:commentId',updateCommentController);
router.put('/update/:commentId/reply/:replyId',updateReplyCommentController);
router.get('/post/:postId',getPostCommentsController);
router.delete('/delete/:commentId',deleteCommentController);
router.delete('/delete/:commentId/reply/:replyId',deleteReplyCommentController);

module.exports= router;