const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlits/wrapAsync.js");
const expressError = require("../utlits/expressError.js");
const {listingSchema} = require("../schema.js");
const listing =require("../models/listing.js");
const{isLoggedIn,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });
 

const validationListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(404,errMsg);
    } else {
        next();
    }
};

//index route
router.get("/",wrapAsync(listingController.index));  

//new router
router.get("/new",isLoggedIn,listingController.renderNewForm);

//search route
router.post("/search",listingController.index);

//show Route
router.get("/:id",wrapAsync(listingController.showListing));

// create router
router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validationListing,
    wrapAsync(listingController.create));
    

//edit router
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));


//update router
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validationListing,
    wrapAsync(listingController.update));
    
//delete router

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete));


module.exports = router;