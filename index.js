const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const Post = require("./models/postModel");
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME;
// TODO: Database Connection
require("./config/dbConnect");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const appError = require("./utils/appError");

// TODO: Middlewares
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    secure:process.env.SECURE,
    cookie:{
        maxAge: 24 * 60 * 60 * 1000
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 24 * 60 * 60 // 1 day in seconds 
    })
}));

app.use((req,res,next)=>{
    if(req.session.foundUser){
        res.locals.userFound = req.session.foundUser;
    }else{
        res.locals.userFound = null;
    }
    next();
});

// ! render Homepage
app.get("/",async(req,res)=>{
    try{
        const allPosts = await Post.find().populate("user");
        res.render("home",{allPosts});
    }
    catch(err){
        res.render("home",{error:err.message});
    }
});

// TODO: Routes
// ! User Routes
app.use("/api/v1/user",userRouter);
// ! Post Routes
app.use("/api/v1/post",postRouter);
// ! Comment Routes
app.use("/api/v1/comment",commentRouter);

// TODO: Error Handler Middlewares
app.use(globalErrorHandler);


// TODO: : Listen Server
app.listen(PORT,HOSTNAME,()=>{
    console.log(`Server Has Been Connected Successfully on ${HOSTNAME}:${PORT}`)
});
