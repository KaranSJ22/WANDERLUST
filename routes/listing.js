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
const passport = require("passport");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");

//app settings
// app.set("view engine","ejs");
// app.set("views", path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));
//

router.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing, wrapAsync(listingController.newList));

//new listing get route

router.get("/new",isLoggedIn,wrapAsync(listingController.newListForm));

//show route
router.route("/:id")
.get(wrapAsync(listingController.showList))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.editUpdate))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteList));



//edit route update
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editForm));




module.exports=router;