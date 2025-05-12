import Joi from "joi";

const createPlaylistValidation = (reqBody) => {
  const createPlaylistSchema = Joi.object({
    name: Joi.string().required().trim().max(50),
    description: Joi.string().required().trim().max(200),
  });

  return createPlaylistSchema.validate(reqBody);
}

const updatePlaylistValidation = (reqBody) => {
  const updatePlaylistSchema = Joi.object({
    name: Joi.string().trim().max(50),
    description: Joi.string().trim().max(200),
  });

  return updatePlaylistSchema.validate(reqBody);
}

export {createPlaylistValidation, updatePlaylistValidation}