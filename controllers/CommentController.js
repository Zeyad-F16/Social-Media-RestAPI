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
    if(!post){
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
    
    res.status(201).json({message:"Comment Created Successfully", comment:newComment});
    }
    
    catch(error) {
     next(error);
    }
}

exports.updateCommentController=async (req,res,next)=>{

    const {commentId}=req.params;
    const {text}=req.body;

    try{
        const commentToUpdate = await CommentDB.findById(commentId)
        if(!commentToUpdate){
            throw new CustomError("Comment not found!",404);
        }

        const updatedComment = await CommentDB.findByIdAndUpdate(commentId, {text} , {new:true} );

        res.status(200).json({message:"Comment updated successfully!",updatedComment});

    }
    catch(error){
        next(error);
    }
}

exports.createCommentReplyController = async(req, res , next)=>{
    const {userId,text} = req.body;
    const {commentId} = req.params;
    
    try{
        const user = await UserDB.findById(userId);
        const comment = await CommentDB.findById(commentId);
        if(!user){
            throw new CustomError("User Not Found!",404);
        }
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }
        
        const reply = {
            text,
            user:userId,
        }
        
        comment.replies.push(reply);
        await comment.save();
        res.status(200).json({message:"Reply Created Successfully",reply});
        
    }
    catch(error){
        next(error);
    }
}


exports.updateReplyCommentController=async(req,res,next)=>{

    const {commentId,replyId}=req.params;
    const {text,userId}=req.body;
    try{
        const comment=await CommentDB.findById(commentId)
        if(!comment){
            throw new CustomError("Comment not found!",404);
        }

        const replyIndex=comment.replies.findIndex((reply)=>reply._id.toString()===replyId)
        if(replyIndex===-1){
            throw new CustomError("Reply not found!",404);
        }

        if(comment.replies[replyIndex].user.toString()!==userId){
            throw new CustomError("You can only update your comments",404);
        }

        comment.replies[replyIndex].text=text;

        await comment.save();
        res.status(200).json({message:"Reply updated successfully!",comment});

    }
    catch(error){
        next(error);
    }
}


const populateUserDetails=async(comments)=>{
    for(const comment of comments){
        await comment.populate("user","username fullName profilePicture");
        if(comment.replies.length>0){
            await comment.populate("replies.user","username fullName profilePicture");
        }
    }
}

exports.getPostCommentsController=async(req,res,next)=>{

    const {postId}=req.params;
    try{
        const post=await PostDB.findById(postId);
        if(!post){
            throw new CustomError("Post not found!",404);
        }

        let comments=await CommentDB.find({post:postId});

        await populateUserDetails(comments);

        res.status(200).json({comments});

    }
    catch(error){
        next(error);
    }
}

exports.deleteCommentController = async(req, res, next)=>{
    const {commentId} = req.params;

    try{
    const comment = await CommentDB.findById(commentId);
    if(!comment){
        throw new CustomError("Comment not found",404);
    }

    await PostDB.findOneAndUpdate(
        {comments: commentId},
        {$pull :{comments: commentId}},
        {new:true}
    )


    await comment.deleteOne();
    res.status(200).json({message:"Comment has been deleted"});

    }
    catch(error) {
    next(error);
    }
}