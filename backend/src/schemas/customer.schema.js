import Joi from "joi";

export const customerSchema = {
  create: Joi.object({
    name: Joi.string().required().min(1).max(255),
    email: Joi.string().email().allow("", null),
    phone: Joi.string().allow("", null),
    address: Joi.string().allow("", null),
    city: Joi.string().allow("", null),
    postalCode: Joi.string().allow("", null),
    country: Joi.string().default("Sweden"),
    organizationNumber: Joi.string().allow("", null),
    vatNumber: Joi.string().allow("", null),
    isActive: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(255),
    email: Joi.string().email().allow("", null),
    phone: Joi.string().allow("", null),
    address: Joi.string().allow("", null),
    city: Joi.string().allow("", null),
    postalCode: Joi.string().allow("", null),
    country: Joi.string(),
    organizationNumber: Joi.string().allow("", null),
    vatNumber: Joi.string().allow("", null),
    isActive: Joi.boolean(),
  }),
};
