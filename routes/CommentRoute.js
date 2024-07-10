const express = require('express');
const router = express.Router();

const { createCommentController ,createCommentReplyController ,updateCommentController, updateReplyCommentController }=require('../controllers/CommentController');

router.post('/create',createCommentController);
router.post('/create/reply/:commentId',createCommentReplyController);
router.put('/updateComment/:commentId',updateCommentController);
router.put('/update/:commentId/reply/:replyId',updateReplyCommentController);

module.exports= router;