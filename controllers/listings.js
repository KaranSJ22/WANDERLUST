const Listing=require("../models/listing");
const cloudinary=require("../cloudConfig");
const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken:mapToken});
//index
module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

//newlist get
module.exports.newListForm=async(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

//newList post
module.exports.newList=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,filename);
    let newList= new Listing (req.body.listing);
    newList.owner=req.user._id;
    newList.image={url,filename};
    newList.geometry=response.body.features[0].geometry;
    let saved=await newList.save();
    console.log(saved);
    req.flash("success","New Listing Added Successfully!");
    res.redirect("/listings");
    // console.log({...req.body.listing});
};

//show list
module.exports.showList=async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing.review.author.username);
    
    if(!listing){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }

};

//editform
module.exports.editForm=async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing Not found");
        res.redirect("/listings");
    }else{
    res.render("./listings/edit.ejs", {listing});
    };
};

//edit form update
module.exports.editUpdate=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
        listing.geometry=response.body.features[0].geometry;
        await listing.save();
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.body.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Edited");
    res.redirect(`/listings/${id}`);
    // console.log({...req.body.listing});
};

module.exports.deleteList=async(req,res)=>{
    let {id}=req.params;
    // let deleteListing= await Listing.findById(id);
    // if(deleteListing&&deleteListing.image&&deleteListing.image.filename){
    //     console.log(deleteListing.image.filename);
    //     await cloudinary.uploader.destroy(deleteListing.image.filename);
    // }
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
    // console.log(deletedListing);
    // console.log(id);
}