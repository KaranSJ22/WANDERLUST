module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Login to Create New Listing");
        return res.redirect("/listings");
    }
    next();
};