const Listing=require("../models/listing");
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
    let newList= new Listing (req.body.listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing Added Successfully!");
    res.redirect("/listings");
    // console.log(newList);
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
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited");
    res.redirect(`/listings/${id}`);
    // console.log({...req.body.listing});
};
module.exports.deleteList=async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
    // console.log(deletedListing);
    // console.log(id);
}