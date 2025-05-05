import Joi from "joi";

const registerUserValidation = (reqBody) => {
  const registerUserSchema = Joi.object({
    fullName: Joi.string().required().trim().max(30),
    username: Joi.string().required().trim().max(50),
    email: Joi.string().required().trim().max(50),
    password: Joi.string().required().trim().min(6),
  });

  return registerUserSchema.validate(reqBody);
};

const loginUserValidation = (reqBody) => {
  const loginUserSchema = Joi.object({
    email: Joi.string().trim().max(50),
    password: Joi.string().required().trim().min(6),
    username: Joi.string().trim().max(40),
  })
    .xor("email", "username") // Ensures either email OR username is provided
    .required();

  return loginUserSchema.validate(reqBody);
};

export { registerUserValidation, loginUserValidation };
