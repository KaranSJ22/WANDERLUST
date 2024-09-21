const express=require("express");
const app=express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const Review= require("./models/review.js");
const User=require("./models/user.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utilities/wrapAsync.js");
const ExpressError=require("./utilities/expressError.js"); 
const {listingSchema}=require("./validationSchema.js");
const {reviewSchema}=require("./validationSchema.js");
const listingRouter =require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const cookieparser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");

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

const sessionOptions={
    secret:"MySuPerSeCReTkEy",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true,
    }
};

// index route
app.get("/",(req,res)=>{
    res.send("Hi, I am root");
    console.dir(req.cookies);
});
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"KaranSJ",
//     });
//    let registeredUser= await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// });

//app settings

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   next();
});

//listing and review route

app.use("/listings",listingRouter); 
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//middlewares

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode=500 , message="something went wrong"}=err;
    res.render("error.ejs",{statusCode,message});
    // res.status(statusCode).send(message);
});

//Main port,server port

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