const userDB = require('../models/UserModel');
const {CustomError} = require('../middlewares/errorMiddleware');


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


module.exports = {getUserController ,updateUserController, followUserController,unFollowUserController};