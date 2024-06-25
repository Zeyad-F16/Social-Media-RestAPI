const express = require('express');
const connectDB = require('./database/db');
const app = express();
const dotenv = require('dotenv');
const authRoute = require("./routes/AuthRoute");
const cookieParser=require('cookie-parser');

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoute);

app.listen(3000,()=>{
    connectDB();
    console.log('Server is running on port 3000');
})

