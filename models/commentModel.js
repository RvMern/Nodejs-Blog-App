const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});


module.exports = new mongoose.model("Comment",commentSchema);