const UserDB = require("../models/UserModel");
const bcrypt = require("bcrypt"); 
const jwt = require('jsonwebtoken');


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
        next(error)
    }
}


const loginController = async (req,res)=>{
    try{
  let user;
  if(req.body.email){
    user= await UserDB.findOne({email:req.body.email});
  }
  else{
   user = await UserDB.findOne({username:req.body.username});
  }

  if(!user){
    return res.status(404).json("User is not found");
  }

  const matchPass = await bcrypt.compare(req.body.password , user.password);

  if(!matchPass){
    return res.status(401).json("Email or Password is not correct");
  }

const {password,...data}= user._doc;
const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn: process.env.JWT_EXPIRE});
res.cookie("token",token).status(200).json(data);
    }
    catch(error){
  res.status(500).json(error);
    }
}


const logoutController =  async(req,res)=>{
    try{
    res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json("user logged out successfully");
    }
    catch(error){
     res.status(500).json(error);
}};


const refetchController = async(req,res)=>{
    const token = req.cookies.token
    jwt.verify(token,process.env.JWT_SECRET_KEY,{},async(err, data)=>{
      console.log(data);
    if(err){
      res.status(404).json(err);
    }
    try{
    const id = data._id;
    const user = await UserDB.findOne({_id:id});
    res.status(200).json(user);
    }
    catch(error){
      res.status(500).json(error);
    }
})
};    


module.exports = {loginController, logoutController, refetchController , registerController};