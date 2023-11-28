const listing =require("./models/listing.js");
const review = require("./models/review.js");


module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must login to create new listing!");
        res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
        res.session.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let Listing = await listing.findById(id);
    if(Listing.owner._id.equals(res.locals._id)){
        req.flash("error","you don't have any access to edit");
      return res.redirect(`/listings/${id}`)
    }
    next()
};


// module.exports.isReviewAuthor = async(req,res,next)=>{
//     let {id,reviewId} = req.params;
//     let Review = await  review.findById(reviewId);
    
//         if (!Review.author.equals(res.locals.curruser._id)) {
//             req.flash("error","you don't have access");
//             return res.redirect(`/listings/${id}`)
//         }

//     next();
// };
 

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let Review = await review.findById(reviewId);

        // Check if Review or curruser is undefined
        if (!Review || !res.locals.curruser || !res.locals.curruser._id) {
            req.flash("error", "Unable to determine access rights");
            return res.redirect(`/listings/${id}`);
        }

        // Check if the author of the review matches the current user
        if (!Review.author.equals(res.locals.curruser._id)) {
            req.flash("error", "You don't have access");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (error) {
        console.error("Error in isReviewAuthor middleware:", error);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect(`/listings/${id}`);
    }
};
