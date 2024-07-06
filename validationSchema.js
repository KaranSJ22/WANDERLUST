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