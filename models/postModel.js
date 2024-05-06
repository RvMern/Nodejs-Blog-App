const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["React.js", "HTML", "CSS", "Node.js", "Javascript", "Others"]
    },
    image:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},
{
    timestamps:true
});


module.exports = new mongoose.model("Post",postSchema);