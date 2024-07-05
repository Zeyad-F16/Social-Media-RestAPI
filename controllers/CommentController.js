const UserDB = require('../models/UserModel');
const {CustomError} = require('../middlewares/errorMiddleware');
const PostDB = require('../models/PostModel');
const CommentDB = require('../models/CommentModel');

exports.createCommentController = async (req, res, next) => {
    const {userId , text, postId} = req.body;
    try{
    const user = await UserDB.findById(userId);
    if(!user){
        throw new CustomError("User not found",404);  
    }
    const post = await PostDB.findById(postId);
    if(!user){
        throw new CustomError("post not found",404);  
    }
    
    const newComment = new CommentDB({
        user : userId,
        post:postId,
        text,
    });
    
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    
    res.status(201).json({message:"post Created Successfully", comment:newComment});
    }
    
    catch(error) {
     next(error);
    }
}