const Joi=require("joi");

 module.exports.listingSchema=Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.object({
            filename:Joi.string().allow("",null),
            url:Joi.string().allow(""),
        }).required(),
        price:Joi.number().integer().min(0).required(),
        location:Joi.string().required(),
        country:Joi.string().required(),

    }).required(),
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().integer().required().min(1).max(5),
    }).required()
});