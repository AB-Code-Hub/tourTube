import Joi from "joi";

const registerUserValidation = (reqBody) => {
  const registerUserSchema = Joi.object({
    fullName: Joi.string().required().trim().max(30),
    username: Joi.string().required().trim().max(50),
    email: Joi.string().required().trim().max(50).email(),
    password: Joi.string().required().trim().min(6),
  });

  return registerUserSchema.validate(reqBody);
};

const loginUserValidation = (reqBody) => {
  const loginUserSchema = Joi.object({
    email: Joi.string().trim().max(50).email(),
    password: Joi.string().required().trim().min(6),
    username: Joi.string().trim().max(40),
  })
    .xor("email", "username") // Ensures either email OR username is provided
    .required();

  return loginUserSchema.validate(reqBody);
};


const changeUserPasswordValidation = (reqBody) => {
  const changeUserPasswordSchema = Joi.object({
    currentPassword: Joi.string().required().trim().min(6),
    newPassword: Joi.string().required().trim().min(6),
  });

  return changeUserPasswordSchema.validate(reqBody);
};

const updateUserValidation = (reqBody) => {
  const updateUserSchema = Joi.object({
    fullName: Joi.string().trim().max(30),
    username: Joi.string().trim().max(50),
    email: Joi.string().trim().max(50).email(),
  });

  return updateUserSchema.validate(reqBody);
};

export { registerUserValidation, loginUserValidation, changeUserPasswordValidation, updateUserValidation };
