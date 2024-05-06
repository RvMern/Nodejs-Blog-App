const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,"fullname is required"],
        minlength:[3,"The name should at least contains 3 characters"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[8,"password should at least contain 8 characters"]
    },
    profileImage:{
        type: String,  
        default: "/images/default_user_profile_image.png"
    },
    coverImage:{
        type:String,
        default:"/images/profile-banner2.jpg"
    },
    role:{
        type:String,
        default: "user"
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
},{
    timestamps:true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.validatePassword = async function(password){
    const isValid = await bcrypt.compare(password,this.password);
    return isValid;
};


module.exports = new mongoose.model("User",userSchema);