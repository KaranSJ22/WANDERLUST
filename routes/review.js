const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilities/wrapAsync.js");
const ExpressError=require("../utilities/expressError.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {reviewSchema}=require("../validationSchema.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

// const path=require("path");
// const ejsMate=require("ejs-mate");
// const methodOverride=require("method-override");
//app settings
// app.set("view engine","ejs");
// app.set("views", path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));

//review portk22j

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview)); 

module.exports=router;