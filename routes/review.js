const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utlits/wrapAsync.js");
const expressError = require("../utlits/expressError.js");
const {reviewschema} = require("../schema.js");
const review = require("../models/review.js");
const listing =require("../models/listing.js");
const{isLoggedIn,isOwner,isReviewAuthor} = require("../middleware.js");

const controllerReview = require("../controllers/reviews.js")

const validatereview = (req,res,next)=>{
    let {error} = reviewschema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(404,errMsg);
    } else {
        next();
    }
};

//review
//post route
 router.post("/",isLoggedIn,validatereview,wrapAsync(controllerReview.postReview));

//review delete route
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(controllerReview.destoryReview))


module.exports = router;