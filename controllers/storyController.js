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