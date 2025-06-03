import Joi from "joi";

export const productSchema = {
  create: Joi.object({
    articleNo: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),
    inPrice: Joi.number().min(0).allow(null),
    price: Joi.number().min(0).required(),
    unit: Joi.string().default("st"),
    inStock: Joi.number().integer().min(0).default(0),
    category: Joi.string().allow("", null),
    isActive: Joi.boolean().default(true),
  }),

  update: Joi.object({
    articleNo: Joi.string(),
    name: Joi.string(),
    description: Joi.string().allow("", null),
    inPrice: Joi.number().min(0).allow(null),
    price: Joi.number().min(0),
    unit: Joi.string(),
    inStock: Joi.number().integer().min(0),
    category: Joi.string().allow("", null),
    isActive: Joi.boolean(),
  }),
};
