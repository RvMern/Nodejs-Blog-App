const Post = require("../models/postModel");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

const getAllPosts = async(req,res,next) => {
    try{
        const allPosts = await Post.find().populate("user");
        res.render("posts",{allPosts});
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const getSinglePost = async(req,res,next) => {
    try{
        const postID = req.params.id;
        const isValidID = mongoose.isValidObjectId(postID);
        if(!isValidID){
            return next(appError(403,"Invalid ID Provided"));
        }
        const foundPost = await Post.findById(postID).populate('user').populate({
            path:'comments',
            populate:{
                path:'user',
                model:'User'
            }
        });
        if(!foundPost){
            return next(appError(403,"Post with the provided ID doesn't exists"));
        }
        res.render("singlePost",{foundPost});
        
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const createPost = async(req,res,next) => {
    try{
        console.log(req.body.category);
        const {title,description,category} = req.body;
        if(title === "" || deletePost === "" || category === ""){
            return res.render("createPost",{error:"All fields are required"});
        }
        if(!req.file){
            return res.render("createPost",{error:"All fields are required"});
        }
        const userID = req.user["_id"];
        const image = req.file?.path;
        if(image === undefined){
            return res.render("createPost",{error:"Unable To create Post as the file was unable to upload on cloudinary"});
        }
        const newPost = await Post.create({
            title,
            description,
            category,
            image,
            user: userID
        });
        const userFound = await User.findById(userID);
        userFound.posts.push(newPost._id);
        await userFound.save();
        req.session.foundUser = userFound;
        res.redirect('/api/v1/user/profile')
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const updatePost = async(req,res,next) => {
    try{
        const postID = req.params.id;
        const foundPost = await Post.findById(postID);
        if(foundPost.user.toString() !== req.user["_id"]){
            return next(appError(403,"Unauthorized Access To Update Post"));
        };
        const updatedImage = req.file?.path;
        if(updatedImage !== undefined){
            await Post.findByIdAndUpdate(postID,{image:updatedImage},{new:true}); 
        };

        await Post.findByIdAndUpdate(postID,req.body,{new:true});
        res.redirect(`/api/v1/post/${postID}`)
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const deletePost = async(req,res,next) => {
    try{
        const postID = req.params.id;
        const foundPost = await Post.findById(postID);
        if(!foundPost){
            return next(appError(404,"The provided ID is not valid Post ID"));
        }
        if(foundPost.user.toString() !== req.user["_id"].toString()){
            return next(appError(403,"Unauthorized Access To Delete Post"));
        };

        await Post.findByIdAndDelete(postID);
        const userID = req.user["_id"];
        const userFound = await User.findById(userID);
        const filteredPosts = userFound.posts.filter(post => post.toString() !== postID.toString());
        userFound.posts = filteredPosts;
        await userFound.save();
        req.session.foundUser = userFound;

        res.redirect('/api/v1/user/profile');
    }
    catch(err){
        next(appError(500,err.message));
    }
};



module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
};