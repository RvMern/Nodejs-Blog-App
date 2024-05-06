const isLoggedIn = (req, res, next) => {
    const session = req.session;
    if("foundUser" in session){
        req.user = session.foundUser;
        req.session.loggedIn = true;
        return next();
    };
    req.session.loggedIn = false;
    res.render("notAuthorized",{title:"Not Authorized"});
    // res.json({
    //     message:"Please Login First",
    //     session: req["session"]
    // });
};


module.exports = isLoggedIn;