const Listing=require("./models/listing");
const ExpressError=require("./utilities/expressError.js"); 
const {listingSchema}=require("./validationSchema.js");
const {reviewSchema}=require("./validationSchema.js");



module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You Must Login");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not Owner of this Listing!");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }

}