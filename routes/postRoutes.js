const express = require("express");
const { getAllPosts, getSinglePost, createPost, updatePost, deletePost } = require("../controllers/postCtrl");
const multer = require("multer");
const storage = require("../config/cloudinary");
const upload = multer({storage});
const isLoggedIn = require("../middlewares/isLoggedIn");
const appError = require("../utils/appError");
const Post = require("../models/postModel");
const route = express.Router();



route.get("/createpost",isLoggedIn,(req,res)=>{
    res.render("createPost",{error:""});
});

route.get("/updatepost/:id", isLoggedIn, async (req,res,next)=>{
    const postFound = await Post.findById(req.params.id);
    if(!postFound){
        return next(appError(404,"Post Not Found"))
    }
    res.render("updatePost",{error:"",postFound});
});

route.get("/",getAllPosts);
route.get("/:id",getSinglePost);
route.post("/createpost", isLoggedIn , upload.single("file"), createPost);
route.put("/updatepost/:id", isLoggedIn, upload.single("file"), updatePost);
route.delete("/deletepost/:id", isLoggedIn, deletePost);





module.exports = route;