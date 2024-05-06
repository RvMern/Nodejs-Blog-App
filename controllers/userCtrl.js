const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

// ! ADMIN Controller
const getAllUsers = async(req,res,next) => {
    try{
        const allUsers = await User.find();
        res.status(200).json({
            success:true,
            message:"All Users Fetched Successfully",
            allUsers
        });
    }
    catch(err){
        next(appError(500,err.message));
    }
};

// ! ADMIN Controller
const getSingleUser = async (req,res,next) => {
    try{
    const userID = req.params.id;
    if(!mongoose.isValidObjectId(userID)){
        return next(appError(402,"Provided ID is Invalid"));
    }
    const singleUser = await User.findOne({_id:userID});
    if(!singleUser){
      return next(appError(404,"User With this id doesn't exist"));
    }
    res.status(200).json({
        success:true,
        user:singleUser
    });
    }
    catch(err){
        next(appError(403,err.message));
    }
};


const getUserProfile = async(req,res,next) => {
    try{
        const userID = req.user["_id"];
        const loggedInUser = await User.findById(userID).populate("comments").populate("posts");
        res.render("profile",{loggedInUser});
    }
    catch(err){
        next(appError(err.message));
    }
};

const registerUser = async(req,res,next) => {
    try{
        const {fullname, email, password} = req.body;
        if(fullname === "" || email === "" || password === ""){
            return res.render("register",{error:"All fields are Required"});
        }
        const foundUser = await User.findOne({email});
        if(foundUser){
            return res.render("register",{error:"The Email is already taken"});
        }
        await User.create(req.body);
        res.redirect("/api/v1/user/login");
    }
    catch(err){ 
        next(appError(403,err.message));
    }

};

const loginUser = async(req,res,next) => {
    try{
        const {email,password} = req.body;
        if(email === "" || password === ""){
            return res.render("login",{error:"All fields are required"});
        }
        const foundUser = await User.findOne({email});
        if(!foundUser){
            return res.render("login",{error:"Invalid Credentials"});
        }
        const validPassword = await foundUser.validatePassword(password);
        if(!validPassword){
            return res.render("login",{error:"Invalid Credentials"});
        }
        req.session.foundUser = foundUser;
        res.redirect("/api/v1/user/profile");
    }
    catch(err){
        next(appError(403,err.message));
    }
    
};

const updateUser = async(req,res,next) => {
    try{
        const user = req.user;
        const {fullname,email} = req.body;
        if(fullname === "" || email === ""){
            return res.render("updateuserdetails",{user,error:"All fields are required"});
        };
        const updatedUser = await User.findByIdAndUpdate({_id:user["_id"]},{
            fullname,
            email
        },{new:true});
        if(!updatedUser){
           return res.render("updateuserdetails",{user,error:"Unable to update the user details"});
        }
        req.session.foundUser = updatedUser;
        res.redirect("/api/v1/user/profile");
    }
    catch(err){
        next(appError(403,err.message));
    };
};


const updateUserPassword  = async(req,res,next) => {
    try{
    const {oldPassword, newPassword, confirmNewPassword} = req.body;
    if(oldPassword === "" || newPassword === "" || confirmNewPassword == ""){
        return res.render("updateUserPassword",{error:"All fields are required"});
    }
    const userFound = await User.findById(req.user["_id"]);
    const confirmOldPassword = await userFound.validatePassword(oldPassword);
    if(!confirmOldPassword){
        return res.render("updateUserPassword",{error:"Old Password Doesn't Match. Please input valid credentials"});
    }
    if(newPassword !== confirmNewPassword){
        return res.render("updateUserPassword",{error:"New Password Doesn't match. Please input valid credentials"});
    }
    userFound.password = newPassword;
    await userFound.save();
    res.redirect("/api/v1/user/logout")
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const uploadCoverImage = async(req,res,next) => {
    try{
        const checkFileStatus = req.file;
        if(!checkFileStatus){
            return res.render("uploadCover",{error:"Please select an image to upload"});
        }
        const coverImage = req.file.path;
        if(!coverImage){
            return res.render("uploadCover",{error:"Image Upload On Cloudinary Failed"});
        }
        const foundUser = await User.findById(req.user["_id"]);
        foundUser.coverImage = req.file.path;
        await foundUser.save();
        req.session.foundUser = foundUser;
        res.redirect("/api/v1/user/profile");
    }
    catch(err){
        next(appError(500,err.message));
    };
};


const uploadProfileImage = async(req,res,next) => {
    try{
        const checkFileStatus = req.file;
        if(!checkFileStatus){
            return res.render("uploadProfile",{error:"Please select an image to upload"});
        }
        const profileImage = req.file.path;
        if(!profileImage){
            return res.render("uploadProfile",{error:"Image Upload On Cloudinary Failed"});
        }
        const foundUser = await User.findById(req.user["_id"]);
        foundUser.profileImage = req.file.path;
        await foundUser.save();
        req.session.foundUser = foundUser;
        res.redirect("/api/v1/user/profile");
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const logoutUser = async(req,res,next) => {
    try{
        req.session.destroy();
        res.redirect("/api/v1/user/login");
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const deleteProfile = async(req,res,next) => {
    try{
        const userFound = await User.findById(req.user["_id"]);
        userFound.posts.forEach(async(post)=>{
            await Post.findByIdAndDelete(post);
        });
        userFound.comments.forEach(async(comment)=>{
           await Comment.findByIdAndDelete(comment);
        });
        
        await User.findByIdAndDelete(req.user["_id"]);
        req.session.destroy();
        res.redirect('/api/v1/user/register');
    }
    catch(err){
        next(appError(500,err.message));
    }
};


module.exports = {
    getAllUsers,
    getSingleUser,
    getUserProfile,
    registerUser,
    loginUser,
    updateUser,
    updateUserPassword,
    uploadCoverImage,
    uploadProfileImage,
    logoutUser,
    deleteProfile
};