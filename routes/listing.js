const express=require("express");
const app=express();
const router=express.Router();
const wrapAsync=require("../utilities/wrapAsync.js");
const ExpressError=require("../utilities/expressError.js"); 
const Listing= require("../models/listing.js");
const {listingSchema}=require("../validationSchema.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const passport = require("passport");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");


//app settings
// app.set("view engine","ejs");
// app.set("views", path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));
//


//LISTING Routes

router.get("/", async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new listing get route

router.get("/new",isLoggedIn,async(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
});

//show route

router.get("/:id", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id).populate("reviews").populate("owner");
    
    if(!listing){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }

}));

//new listing post route

router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
    let newList= new Listing (req.body.listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing Added Successfully!");
    res.redirect("/listings");
    // console.log(newList);
    // console.log({...req.body.listing});
}));

//edit route update

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing Not found");
        res.redirect("/listings");
    }else{
    res.render("./listings/edit.ejs", {listing});
    };
}));

router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited");
    res.redirect(`/listings/${id}`);
    // console.log({...req.body.listing});
}));

//delete route

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
    // console.log(deletedListing);
    // console.log(id);
}));

module.exports=router;