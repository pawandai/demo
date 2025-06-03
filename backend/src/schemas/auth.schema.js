import Joi from "joi";

export const authSchema = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(255),
    company: Joi.string().allow("", null).max(100),
    language: Joi.string().valid("en", "sv").default("sv"),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(255),
    company: Joi.string().allow("", null).max(100),
  }),
};
