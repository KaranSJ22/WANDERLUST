const User=require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
    try {
        let {username, email, password}=req.body;
        const newUser=new User({email,username});
        const registererdUser= await User.register(newUser,password);
        req.login(registererdUser,(err)=>{
            if(err){
                return next(err);
            }
        });
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
        // console.log(req.body);
        // console.log(registererdUser);
    } catch (error) {
       req.flash("error",error.message);
       res.redirect("/signup");
    };

};

module.exports.renderLoginForm=async(req,res,next)=>{
    res.render("./users/login.ejs");
};

module.exports.login=async(req,res,next)=>{
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out!");
        res.redirect("/listings");
    });
};