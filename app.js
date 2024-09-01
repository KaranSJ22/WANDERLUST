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
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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


// index route

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

app.use("/listings",listings); 
app.use("/listings/:id/reviews",reviews);







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








