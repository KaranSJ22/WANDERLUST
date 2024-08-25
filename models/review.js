const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema= new Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    createdAt:Date,
});

const Review= mongoose.model("Review",reviewSchema);
module.exports=Review; 