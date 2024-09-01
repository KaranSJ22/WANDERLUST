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


//app settings
// app.set("view engine","ejs");
// app.set("views", path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));
//
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};



//LISTING Routes
router.get("/", async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new listing get route

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route

router.get("/:id", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));

//new listing post route

router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
    
    let newList= new Listing (req.body.listing);
    // console.log({...req.body.listing});
    await newList.save();
    // console.log(newList);
    res.redirect("/listings");
}));

//edit route

router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log({...req.body.listing});
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route

router.delete("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let deletedListing= await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;