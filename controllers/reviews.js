const review = require("../models/review.js");
const listing =require("../models/listing.js");


module.exports.postReview = async(req,res)=>{
    let list = await listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author =req.user._id;
    list.reviews.push(newreview);

    await newreview.save();
    await list.save();
    req.flash("success","review is Created!")
    res.redirect(`/listings/${list._id}`)
}

module.exports.destoryReview = async(req,res)=>{
    let {id , reviewId} =req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}});
    await review.findById(reviewId)
    req.flash("success","review is deleted!")
    res.redirect(`/listings/${id}`)
}