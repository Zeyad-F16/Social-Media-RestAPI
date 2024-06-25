const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
   await mongoose.connect(process.env.DB_URL)
   console.log("db is connected");
    }
    catch(error) { 
        console.log("db is not connected"+error);
    }
}

module.exports = connectDB;