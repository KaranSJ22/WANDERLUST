const express=require("express");
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing= require("../models/listing.js");

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
const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66ea86d96fb68a9a3d7f64bd"}))
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
};

initDB();