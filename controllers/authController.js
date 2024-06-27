const UserDB = require("../models/UserModel");
const bcrypt = require("bcrypt"); 
const jwt = require('jsonwebtoken');
const {CustomError} = require('../middlewares/errorMiddleware');


const registerController = async (req,res,next)=>{
    try{
       const {password,username,email}=req.body
       const existingUser=await UserDB.findOne({ $or: [{username},{email}] })
       if(existingUser){
         throw new CustomError("Username or email already exists!",400)
       }

       const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hashSync(password,salt)
       const newUser=new UserDB({...req.body,password:hashedPassword})
       const savedUser=await newUser.save()
       res.status(201).json(savedUser)
       
    }
    catch(error){
        next(error);
    }
}


const loginController = async (req,res,next)=>{
    try{
  let user;
  if(req.body.email){
    user= await UserDB.findOne({email:req.body.email});
  }
  else{
   user = await UserDB.findOne({username:req.body.username});
  }

  if(!user){
  throw new CustomError("user not found!",404);
  }

  const matchPass = await bcrypt.compare(req.body.password , user.password);

  if(!matchPass){
    throw new CustomError("Email or Password is not correct",404);
  }

const {password,...data}= user._doc;
const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn: process.env.JWT_EXPIRE});
res.cookie("token",token).status(200).json(data);
    }
    catch(error){
  next(error);
    }
}


const logoutController =  async(req,res,next)=>{
    try{
    res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json("user logged out successfully");
    }
    catch(error){
      next(error);
}};


const refetchController = async(req,res,next)=>{
    const token = req.cookies.token
    jwt.verify(token,process.env.JWT_SECRET_KEY,{},async(err, data)=>{
    if(err){
      throw new CustomError(err,404);
    }
    try{
    const id = data._id;
    const user = await UserDB.findOne({_id:id});
    res.status(200).json(user);
    }
    catch(error){
      next(error);
    }
})
};    


module.exports = {loginController, logoutController, refetchController , registerController};