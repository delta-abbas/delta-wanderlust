const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    // Initial fetch of all listings
    const alllistings = await listing.find({});

    // If it's a POST request with search parameters
    if (req.method === 'POST') {
        const { location } = req.body;
          // Replace spaces with an optional space regex
          const searchTerm = location.split('').join('\\s?').toLowerCase();

        // Perform the search
        const results = await listing.find({
            location : { $regex: new RegExp(searchTerm, "i") }
        });
         
        if(results.length === 0) {
            req.flash("error", "place you requested does not exist please try new one!");
            return res.redirect("/listings");
        }

        // Render the 'index' EJS view with search results
        return res.render("index.ejs", { alllistings,results });
    }
    // Render the 'index' EJS view with all listings
    res.render("index.ejs", { alllistings, results: [] });
};

module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id)
        .populate({
            path : "reviews",
            populate : {
                path : "author"
            }
        })
        .populate("owner");
    if(!listings) {
        req.flash("error","listing you requested does not exits!");
        res.redirect("/listings")
    }
    res.render("show.ejs",{listings})

}

module.exports.edit = async (req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);

    
    if(!listings) {
        req.flash("error","listing you requested does not exits!");
        res.redirect("/listings")
    }
    res.render("edit.ejs",{listings})
}

module.exports.create = async(req,res,next)=>{
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
 
    let url = req.file.path;
    let filename =req.file.filename;
    
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url , filename};
    newlisting.geometry = response.body.features[0].geometry;
     await newlisting.save();
     

    req.flash("success","New Listing Created!")
    res.redirect("/listings");
 
}

module.exports.update = async(req,res)=>{
    let {id} = req.params;
    let Listing = await listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename =req.file.filename;
        Listing.image = {url,filename};
        await Listing.save()
    }
    req.flash("success","Changes saved")
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!")
    res.redirect("/listings")
}