import Joi from "joi"
const pubishedVideoValidation = (reqBody) => {
    const publishVideoSchema =  Joi.object({
        title: Joi.string().required().trim().max(40),
        description: Joi.string().required().trim().max(150)
    })
    return publishVideoSchema.validate(reqBody);
}




export {pubishedVideoValidation}