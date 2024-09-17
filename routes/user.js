const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res,next)=>{
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

}));

router.get("/login",wrapAsync(async(req,res,next)=>{
    res.render("./users/login.ejs");
}));

router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(async(req,res,next)=>{
    res.redirect("/listings");
}));

router.get("/logout",wrapAsync(async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out!");
        // req.flash("error","Couldn't logout!");
        res.redirect("/listings");
    })
}))

module.exports= router;
