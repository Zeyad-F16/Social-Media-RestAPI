const express = require('express');
const router = express.Router();

const { createCommentController ,
    createCommentReplyController ,
          updateCommentController,
     updateReplyCommentController,
     getPostCommentsController,
     deleteCommentController,
     deleteReplyCommentController,
     likeCommentController,
     dislikeCommentController,
     likeReplyCommentController,
     dislikeReplyCommentController }=require('../controllers/CommentController');

router.post('/create',createCommentController);
router.post('/create/reply/:commentId',createCommentReplyController);
router.put('/updateComment/:commentId',updateCommentController);
router.put('/update/:commentId/reply/:replyId',updateReplyCommentController);
router.get('/post/:postId',getPostCommentsController);
router.delete('/delete/:commentId',deleteCommentController);
router.delete('/delete/:commentId/reply/:replyId',deleteReplyCommentController);
router.post('/like/:commentId',likeCommentController);
router.post('/dislike/:commentId',dislikeCommentController);
router.post('/like/:commentId/reply/:replyId',likeReplyCommentController);
router.post('/dislike/:commentId/reply/:replyId',dislikeReplyCommentController);

module.exports= router;