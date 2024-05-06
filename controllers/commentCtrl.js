const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const appError = require("../utils/appError");

// ! ADMIN Controller
const getAllComments = async(req,res) => {};

// ! ADMIN Controller
const getSingleComment = async(req,res) => {};


const createComment = async(req,res,next) => {
    try{
        const postID = req.params.id;
        const userID = req.user["_id"];
        const {rating,comment} = req.body;
        if(rating === "" || comment === ""){
            return res.redirect(`/api/v1/post/${postID}?`);
        }
        const findPost = await Post.findById(postID);
        if(!findPost){
            return next(appError(404,"The entered ID is not valid Post ID"));
        }
        const findComment = await Comment.findOne({$and:[{user:userID},{post:postID}]});
        if(findComment){
            await Comment.findByIdAndUpdate(findComment["_id"],{
                rating,
                comment
            },
            {
                new:true
            });

            return res.redirect(`/api/v1/post/${postID}?`);
        }
        const newComment = await Comment.create({
            user:userID,
            post: postID,
            rating,
            comment
        });
        const foundPost = await Post.findById(postID);
        foundPost.comments.push(newComment["_id"]);
        await foundPost.save({validateBeforeSave:false});
        const userFound = await User.findById(userID);
        userFound.comments.push(newComment["_id"]);
        await userFound.save({validateBeforeSave:false});
        req.session.foundUser = userFound;

        res.redirect(`/api/v1/post/${postID}?`);
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const updateComment = async(req,res) => {
    try{
    const commentID = req.params.id;
    const findComment = await Comment.findById(commentID);
    if(!findComment){
        return next(appError(404,"The provided ID is not valid Comment ID"));
    };
    if(findComment.user.toString() !== req.user["_id"].toString()){
        return next(appError(403,"Unauthorized Accesss To Update this comment"));
    }
    const {rating,comment} = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(commentID,{
        rating,
        comment
    },{new:true});
    res.status(200).json({
        success:true,
        message:"The comment has been updated Successfully",
        updatedComment
    });
    }
    catch(err){
        next(appError(500,err.message));
    }
};


const deleteComment = async(req,res,next) => {
   try{
    const commentID = req.params.id;
    const findComment = await Comment.findById(commentID);
    if(!findComment){
        return next(appError(404,"The provided ID is not valid Comment ID"));
    };
    if(findComment.user.toString() !== req.user["_id"].toString()){
        return next(appError(403,"You are not authorized to delete this comment"));
    }
    const postID = findComment.post;
    const userID = findComment.user;

    const findPost = await Post.findById(postID);
    const filterPostComments = findPost.comments.filter(comment => comment.toString() !== commentID.toString());
    findPost.comments = filterPostComments;
    await findPost.save();

    const findUser = await User.findById(userID);
    const filterUserComments = findUser.comments.filter(comment => comment.toString() !== commentID.toString());
    findUser.comments = filterUserComments;
    await findUser.save();
    req.session.foundUser = findUser;

    await Comment.findByIdAndDelete(commentID);

    res.redirect(`/api/v1/post/${postID}`);
   }
   catch(err){
    next(appError(500,err.message));
   }
};



module.exports = {
    getAllComments,
    getSingleComment,
    createComment,
    updateComment,
    deleteComment
};