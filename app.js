const express=require("express");
const app=express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const Review= require("./models/review.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utilities/wrapAsync.js");
const ExpressError=require("./utilities/expressError.js");
const {listingSchema}=require("./validationSchema.js");
const {reviewSchema}=require("./validationSchema.js");

// connecting and creating to wanderlust db
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main () {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
});

//app settings

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// server port and middlewares

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

// index route

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});


app.get("/listings", async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new listing get route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route

app.get("/listings/:id", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});

}));

//new listing post route

app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
    
    let newList= new Listing (req.body.listing);
    console.log({...req.body.listing});
    await newList.save();
    // console.log(newList);
    res.redirect("/listings");
}));

//edit route

app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log({...req.body.listing});
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route

app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let deletedListing= await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));

//review port

const validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }

}

app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(newReview);  
    res.redirect(`/listings/${listing._id}`);
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));



//middlewares
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode=500 , message="something went wrong"}=err;
    res.render("error.ejs",{statusCode,message});
    // res.status(statusCode).send(message);
});

//Main Port number

app.listen(8080,()=>{
    console.log("server running on port 8080");
});


























































// app.get("/testlistings", async(req,res)=>{
//     let sampleListing= new Listing({
//         title: "My Villa",
//         description:"Most loved and unique villa",
//         price:12000,
//         location:"Bengaluru",
//         country:"India"
//     });
//     await sampleListing.save()
//     .then(()=>{
//         console.log("data saved to db");
//     })
//     .catch((err)=>{
//         console.log(err);
//     });
// });








