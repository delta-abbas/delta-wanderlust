const listing =require("./models/listing.js");


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