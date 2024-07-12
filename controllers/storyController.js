const PostDB = require('../models/PostModel');
const UserDB = require('../models/UserModel');
const StoryDB = require('../models/StoryModel');
const CommentDB = require('../models/CommentModel');
const {CustomError} = require('../middlewares/errorMiddleware');


exports.createStoryController=async(req,res,next)=>{
    const {userId}=req.params;
    const {text}=req.body;
    
    try{
        const user=await UserDB.findById(userId)
        
        if(!user){
            throw new CustomError("No user found",404);
        }
        let image="";

        if(req.file){
            image=process.env.URL+`/uploads/${req.file.filename}`;
        }

        const newStory=new StoryDB({
            user:userId,
            image,
            text
        });

        await newStory.save();
        res.status(200).json(newStory);

    }
    catch(error){
        next(error);
    }
}


exports.getStoriesController=async(req,res,next)=>{
    const {userId}=req.params;
    try{
        const user=await UserDB.findById(userId);
        
        if(!user){
            throw new CustomError("No user found",404);
        }

        const followingUsers=user.following;
        const stories=await StoryDB.find({user:{$in:followingUsers}}).populate("user","fullName username profilePicture");

        res.status(200).json(stories);

    }
    catch(error){
        next(error);
    }
}


exports.getUserStoriesController=async(req,res,next)=>{
    const userId=req.params.userId;
    try{
        const user=await UserDB.findById(userId);
        
        if(!user){
            throw new CustomError("No user found",404)
        }

        const stories=await StoryDB.find({user:userId}).populate("user","fullName username profilePicture");
        res.status(200).json(stories);

    }
    catch(error){
        next(error);
    }

}