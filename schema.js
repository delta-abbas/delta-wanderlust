const joi = require("joi");


module.exports.listingSchema = joi.object({
    listing : joi.object({
        title :joi.string().required(),
        description :joi.string().required(),
        image :joi.string().allow("",null),
        price :joi.number().required().min(0),
        country :joi.string().required(),
        location :joi.string().required(),
    }).required()
});


module.exports.reviewschema = joi.object({
    review:joi.object({
        rating : joi.number().required(),
        comment : joi.string().required(),
    }).required(),
});