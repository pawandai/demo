import Joi from "joi";

export const termsSchema = {
  create: Joi.object({
    language: Joi.string().valid("sv", "en").required(),
    content: Joi.string().required().min(1),
    version: Joi.string().default("1.0.0"),
    isActive: Joi.boolean().default(true),
  }),

  update: Joi.object({
    language: Joi.string().valid("sv", "en"),
    content: Joi.string().min(1),
    version: Joi.string(),
    isActive: Joi.boolean(),
  }),
};
