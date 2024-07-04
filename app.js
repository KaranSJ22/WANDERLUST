const express=require("express");
const app=express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

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

// server port settings

app.listen(8080,()=>{
    console.log("server running on port 8080");
});

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

// index route

app.get("/listings", async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new listing get route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route

app.get("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});

});

//new listing post route


app.post("/listings", async(req,res)=>{
    let newList= new Listing (req.body.listing);
    console.log({...req.body.listing});
    await newList.save();
    // console.log(newList);
    res.redirect("/listings");
});

//edit route

app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

app.put("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    // console.log({...req.body.listing});
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete route

app.delete("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let deletedListing= await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
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








