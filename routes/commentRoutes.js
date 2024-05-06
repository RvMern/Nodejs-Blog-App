const express = require("express");
const { getAllComments, getSingleComment, createComment, deleteComment, updateComment } = require("../controllers/commentCtrl");
const isLoggedIn = require("../middlewares/isLoggedIn");
const route = express.Router();


route.get("/",getAllComments);
route.get("/:id",getSingleComment);
route.post("/createcomment/:id", isLoggedIn, createComment);
route.put("/updatecomment/:id", isLoggedIn ,updateComment);
route.delete("/deletecomment/:id", isLoggedIn, deleteComment);





module.exports = route;