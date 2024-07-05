const PostDB = require('../models/PostModel');
const UserDB = require('../models/UserModel');
const CommentDB = require('../models/CommentModel');
const {CustomError} = require('../middlewares/errorMiddleware');

// Create Post
exports.createPostController = async (req, res, next) => {
const {userId , caption} = req.body;
try{
const user = await UserDB.findById(userId);
if(!user){
    throw new CustomError("User not found",404);  
}

const newPost = new PostDB({
    user : userId,
    caption,
});

await newPost.save();
user.posts.push(newPost._id);
await user.save();
res.status(201).json({message:"post Created Successfully", post:newPost});
}

catch(error) {
 next(error);
}
}


const generateFileUrl =(filename)=>{
    return process.env.URL+`/uploads/${filename}`
  }

exports.createPostWithImageController = async(req,res,next)=>{
    const {userId} = req.params;
    const {caption} = req.body;
    const files = req.files;

    try{
        const user = await UserDB.findById(userId);
        if(!user){
            throw new CustomError("User not found",404);
        }
        const imageUrl = files.map(file=>generateFileUrl(file.filename));
        const newPost = new PostDB({
            user : userId,
            caption,
            image:imageUrl
        });
        await newPost.save();
        user.posts.push(newPost._id);
        await user.save();
        res.status(201).json({message:"post Created Successfully", post:newPost});
    }
    catch(error){
        next(error);
    }
} 


// update post
exports.updatePostController=async(req,res,next)=>{
    const {postId}=req.params;
    const {caption}=req.body;
    try{
        const postToUpdate=await PostDB.findById(postId)
        if(!postToUpdate){
            throw new CustomError("Post not found!",404);
        }

        const updatedPost = await PostDB.findByIdAndUpdate(
            postId,
            {caption},
            { new: true }
          );

         await postToUpdate.save();
        res.status(200).json({message:"Post updated successfully!",post:updatedPost});

    }
    catch(error){
        next(error);
    }
}

// get all posts
exports.getallPostsController=async(req,res,next)=>{
    const {userId}=req.params;
    try{
        const user=await UserDB.findById(userId);
        if(!user){
            throw new CustomError("User not found!",404);
        }

        const blockedUserIds=user.blockList.map(id=>id.toString());

        const allPosts=await PostDB.find({user:{$nin:blockedUserIds}}).populate("user","username fullName profilePicture");
        res.status(200).json({posts:allPosts});

    }
    catch(error){
        next(error);
    }
}


// get user posts
exports.getUserPostsController=async(req,res,next)=>{
    const {userId}=req.params;
    try{
        const user=await UserDB.findById(userId);
        if(!user){
            throw new CustomError("User not found!",404);
        }

        const userPosts=await PostDB.find({user:userId});

        res.status(200).json({posts:userPosts});

    }
    catch(error){
        next(error);
    }
}

//delete post
exports.deletePostController=async (req,res,next)=>{
    const {postId}=req.params;
    try{
        const postToDelete=await PostDB.findById(postId);
        if(!postToDelete){
            throw new CustomError("Post not found!",404);
        }
        const user=await UserDB.findById(postToDelete.user);
        if(!user){
            throw new CustomError("User not found!",404);
        }
        user.posts=user.posts.filter(postId=>postId.toString()!==postToDelete._id.toString());
        await user.save();
        await postToDelete.deleteOne();
        await CommentDB.deleteMany({post:postId});

        res.status(200).json({message:"Post deleted successfully!"});

    }
    catch(error){
        next(error);
    }
}


exports.likePostController = async(req,res,next)=>{
const {postId}=req.params;
const {userId}=req.body;
try{
    const post=await PostDB.findById(postId);
    if(!post){
        throw new CustomError("Post not found!",404);
    }
    const user=await UserDB.findById(userId);
    if(!user){
        throw new CustomError("User not found!",404);
    }
    if(post.likes.includes(userId)){
        throw new CustomError("You are already liked this post",404);
    }

   post.likes.push(userId);
   await post.save();
   res.status(200).json({message: "Post liked Successfully"});
}
catch(error){
    next(error);
  }
}


exports.disLikePostController = async(req,res,next)=>{
const {postId}=req.params;
const {userId}=req.body;
try{
    const post=await PostDB.findById(postId);
    if(!post){
        throw new CustomError("Post not found!",404);
    }
    const user=await UserDB.findById(userId);
    if(!user){
        throw new CustomError("User not found!",404);
    }
    if(!post.likes.includes(userId)){
        throw new CustomError("You are already disliked this post",404);
    }

    post.likes = post.likes.filter(id=>id.toString()!==userId);

   await post.save();
   res.status(200).json({message: "Post disliked Successfully"});
}
catch(error){
    next(error);
  }
}
