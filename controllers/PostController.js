const PostDB = require('../models/PostModel');
const UserDB = require('../models/UserModel');
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
