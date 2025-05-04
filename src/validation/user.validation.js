import Joi from "joi";


const registerUserValidation = (reqBody) => {
    const registerUserSchema = Joi.object({
        fullName: Joi.string().required().trim().max(30),
        username: Joi.string().required().trim().max(50),
        email: Joi.string().required().trim().max(50),
        password: Joi.string().required().trim().min(6),
        
    })

    return registerUserSchema.validate(reqBody)
}


export {registerUserValidation}