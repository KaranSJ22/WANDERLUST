const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{ 
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename: {
            type:String,
            default:"listingimage"
        },
        url:{
            type:String,
            default:"https://tinyurl.com/uc37ux9c",
            set: (v) => v==="" ? "https://tinyurl.com/uc37ux9c" : v,
        }
    },
    price:Number,
    location:String,
    country:String,
});

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing; 