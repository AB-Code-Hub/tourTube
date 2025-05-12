import Joi from "joi"
const pubishedVideoValidation = (reqBody) => {
    const publishVideoSchema =  Joi.object({
        title: Joi.string().required().trim().max(40),
        description: Joi.string().required().trim().max(150)
    })
    return publishVideoSchema.validate(reqBody);
}

const updateVideoValidation = (reqBody) => {
    const updateVideoSchema =  Joi.object({
        title: Joi.string().optional().trim().max(40),
        description: Joi.string().optional().trim().max(150)
    })
    return updateVideoSchema.validate(reqBody);
}



export {updateVideoValidation, pubishedVideoValidation}