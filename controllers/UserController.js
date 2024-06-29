const userDB = require('../models/UserModel');
const {CustomError} = require('../middlewares/errorMiddleware');
const postDB = require('../models/PostModel');
const commentDB = require('../models/CommentModel');
const storyDB = require('../models/StoryModel');

// Get User By Id 
const getUserController = async(req , res, next)=>{
const {userId}=req.params
try{
const user = await userDB.findById(userId);
if(!user){
    throw new CustomError("User not found",404);
}

const {password,...data}=user._doc;
res.status(200).json(data);

}
catch(error){
next(error);
  }
}

//Update User
const updateUserController = async(req , res ,next)=>{
const {userId} = req.params;
const updateUserData = req.body;
try{
    const user = await userDB.findById(userId);
    if(!user){
        throw new CustomError("User not found to update",404);
    }

    Object.assign(user,updateUserData);

    await user.save();

    res.status(200).json({message:"user Updated Successfully!", userData : user});
}
catch(error) {
    next(error);
  }
}

//Follow User
const followUserController = async(req , res , next)=>{
  const {userId} = req.params;
  const {_id} = req.body;
  try{
if(userId === _id){
  throw new CustomError("You can't follow yourself",400);
}

const userToFollow= await userDB.findById(userId);
const loggedInUser= await userDB.findById(_id);

if(!userToFollow || !loggedInUser){
throw new CustomError("User not Found!",404);
}

if(loggedInUser.following.includes(userId)){
  throw new CustomError("You are already following this user",400);
}

loggedInUser.following.push(userId);
userToFollow.followers.push(_id);

await loggedInUser.save();
await userToFollow.save();

res.status(200).json({message:"Successfully Followed User"});

}
  catch(error) {
  next(error);
  }
}

//UnFollow User
const unFollowUserController = async(req , res , next)=>{
  const {userId} = req.params;
  const {_id} = req.body;
  try{
if(userId === _id){
  throw new CustomError("You can't Unfollow yourself",400);
}

const userToUnFollow= await userDB.findById(userId);
const loggedInUser= await userDB.findById(_id);

if(!userToUnFollow || !loggedInUser){
throw new CustomError("User not Found!",404);
}

if(!loggedInUser.following.includes(userId)){
  throw new CustomError("You are already Unfollowing this user",400);
}

loggedInUser.following = loggedInUser.following.filter(id=>id.toString()!==userId);
userToUnFollow.followers = userToUnFollow.followers.filter(id=>id.toString()!==_id);

await loggedInUser.save();
await userToUnFollow.save();

res.status(200).json({message:"Successfully UnFollowed User"});

}
  catch(error) {
  next(error);
  }
}


// Block User
const blockUserController = async(req , res , next)=>{
  const {userId} = req.params;
  const {_id} = req.body;
  try{
if(userId === _id){
  throw new CustomError("You can't block yourself",400);
}

const userToBlock= await userDB.findById(userId);
const loggedInUser= await userDB.findById(_id);

if(!userToBlock || !loggedInUser){
throw new CustomError("User not Found!",404);
}

if(loggedInUser.blockList.includes(userId)){
  throw new CustomError("You are already blocked this user",400);
}

loggedInUser.blockList.push(userId);

loggedInUser.following = loggedInUser.following.filter(id=>id.toString()!==userId);
userToBlock.followers = userToBlock.followers.filter(id=>id.toString()!==_id);

await loggedInUser.save();
await userToBlock.save();

res.status(200).json({message:"Successfully Blocked User"});

}
  catch(error) {
  next(error);
  }
}


// unBlock User
const unblockUserController = async(req , res , next)=>{
  const {userId} = req.params;
  const {_id} = req.body;
  try{
if(userId === _id){
  throw new CustomError("You can't unblock yourself",400);
}

const userToUnBlock= await userDB.findById(userId);
const loggedInUser= await userDB.findById(_id);

if(!userToUnBlock || !loggedInUser){
throw new CustomError("User not Found!",404);
}

if(!loggedInUser.blockList.includes(userId)){
  throw new CustomError("You are already unblocked this user",400);
}

loggedInUser.blockList = loggedInUser.blockList.filter(id=>id.toString()!==userId);

await loggedInUser.save();

res.status(200).json({message:"Successfully unBlocked User"});

}
  catch(error) {
  next(error);
  }
}


// Blocklist
const blockListController = async(req , res , next)=>{
  const {userId}= req.params;
  try{
  const user =  await userDB.findById(userId).populate("blockList","username fullName profilePicture");
  if(!user){
    throw new CustomError("User not Found!",404);
  }

  const {blockList,...data}=user;

  res.status(200).json(blockList);
  
}
  catch(error) {
    next(error);
  }
}


// Delete user
const deleteUserController = async (req,res,next)=>{
  const {userId}= req.params;
  try{
    const userToDelete = await userDB.findById(userId);
    if(!userToDelete){
      throw new CustomError("User not Found!",404);
    }
    await postDB.deleteMany({user:userId});
    await postDB.deleteMany({"comments.user":userId});
    await postDB.deleteMany({"comments.replies.user":userId});
    await commentDB.deleteMany({user:userId});
    await storyDB.deleteMany({user:userId});
    await postDB.deleteMany({likes:userId},{$pull:{likes:userId}});
    await userDB.updateMany(
        {_id:{$in:userToDelete.following}},
        {$pull:{followers:userId}});
    await commentDB.updateMany({},{$pull:{likes:userId}});
    await commentDB.updateMany({"replies.likes":userId},{$pull:{"replies.likes":userId}});    
    await postDB.updateMany({},{$pull:{likes:userId}});
   
    const replyComment = await commentDB.find({"replies.user":userId});

    await Promise.all(
      replyComment.map(async(comment)=>{
        comment.replies=comment.replies.filter((reply)=>reply.user.toString()!=userId)
      })
    )
    await userToDelete.deleteOne();
    res.status(200).json({message:"User deleted successfully"});
  }
  catch(error){
  next(error)
  }
}

// search
const searchUserController = async(req,res,next)=>{
  const {query}=req.params;
  try{
  const user = await userDB.find({
    $or:[
      {username:{$regex:new RegExp(query,'i')}},
      {fullName:{$regex:new RegExp(query,'i')}}
    ]
  });

  res.status(200).json({user});
  }
  catch{
    next(error);
  }
}

const generateFileUrl =(filename)=>{
  return process.env.URL+`/uploads/${filename}`
}

//upload profile Image
const uploadImageController= async(req,res,next)=>{
  const {userId}=req.params;
  const {filename}=req.file;
  try{
  const user = await userDB.findByIdAndUpdate(userId,{profilePicture:generateFileUrl(filename)},{new:true});
  if(!user){
    throw new CustomError("User not Found!",404);
  }
res.status(200).json({message:"Profile Picture Updated Successfully",user});
}
  catch(error){
  next(error);
    }
}
//upload cover Image
const uploadCoverImageController= async(req,res,next)=>{
  const {userId}=req.params;
  const {filename}=req.file;
  try{
  const user = await userDB.findByIdAndUpdate(userId,{coverPicture:generateFileUrl(filename)},{new:true});
  if(!user){
    throw new CustomError("User not Found!",404);
  }
res.status(200).json({message:"Cover Picture Updated Successfully",user});
}
  catch(error){
  next(error);
    }
}


module.exports = {getUserController ,
                updateUserController,
                followUserController,
              unFollowUserController,
                 blockUserController,
               unblockUserController,
                 blockListController,
                deleteUserController,
                searchUserController,
               uploadImageController,
           uploadCoverImageController };