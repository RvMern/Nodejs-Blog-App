const express = require("express");
const { getAllUsers, getUserProfile, registerUser, loginUser, updateUser, deleteProfile, logoutUser, getSingleUser, updateUserPassword, uploadProfileImage, uploadCoverImage } = require("../controllers/userCtrl");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const multer = require("multer");
const storage = require("../config/cloudinary");
// ! If you do not pass storage variable inside curly braces then in req.file you will not get path property
const upload = multer({storage});
const route = express.Router();

route.get("/",isLoggedIn, getAllUsers);

route.get("/login",(req,res)=>{
    if(req.session.foundUser){
        return res.redirect("/api/v1/user/profile");
    }
    res.render("login",{error:""});
});

route.get("/register",(req,res)=>{
    if(req.session.foundUser){
        return res.redirect("/api/v1/user/profile");
    }
    res.render("register",{
        error:""
    });
});

route.get("/upload-profileimage",isLoggedIn,(req,res)=>{
    res.render("uploadProfile",{error:""});
});

route.get("/upload-coverimage",isLoggedIn,(req,res)=>{
    res.render("uploadCover",{error:""});
});

route.get("/updateuserpassword",isLoggedIn,(req,res)=>{
    res.render("updateUserPassword",{error:""});
});

route.get("/updateuserdetails",isLoggedIn, (req,res)=>{
    const user = req.user;
    res.render("updateUserDetails",{user, error:""});
});

route.post("/register",registerUser);
route.post("/login",loginUser);
route.put("/profileimage", isLoggedIn, upload.single("file"),uploadProfileImage);
route.put("/coverimage",isLoggedIn,upload.single("file"), uploadCoverImage);
route.get("/profile",isLoggedIn, getUserProfile);
route.get("/logout", isLoggedIn, logoutUser);
// ! Admin Route
route.get("/admin/:id",isLoggedIn, isAdmin, getSingleUser);
route.put("/updateuser", isLoggedIn,updateUser);
route.put("/updateuserpassword", isLoggedIn, updateUserPassword);

route.delete("/deleteprofile", isLoggedIn, deleteProfile);





module.exports = route;