const express = require('express');
const connectDB = require('./database/db');
const app = express();
const dotenv = require('dotenv');
const authRoute = require("./routes/AuthRoute");
const cookieParser=require('cookie-parser');
const path= require('path');
const {errorHandler} = require('./middlewares/errorMiddleware');
const UserRoute = require('./routes/UserRoute');
const PostRoute = require('./routes/PostRoute');
const CommentRoute = require('./routes/CommentRoute');
const StoryRoute = require('./routes/storyRoute');

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

//Mount Routes
app.use("/api/auth",authRoute);
app.use("/api/user",UserRoute);
app.use("/api/post",PostRoute);
app.use("/api/comment",CommentRoute);
app.use("/api/story",StoryRoute);

// Global Error Handler
app.use(errorHandler);

app.listen(3000,()=>{
    connectDB();
    console.log('Server is running on port 3000');
})

