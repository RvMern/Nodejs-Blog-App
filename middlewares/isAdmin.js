const appError = require("../utils/appError");

const isAdmin = (req,res,next) => {
    const userRole = req.user.role;
    if(userRole === "admin"){
        next();
    }
    else{
        next(appError(400,"Unauthorized Access. You are not an Admin"));
    };
};


module.exports = isAdmin;