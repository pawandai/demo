import Joi from "joi";

const invoiceItemSchema = Joi.object({
  productId: Joi.string().uuid().allow(null),
  description: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).max(100).default(25.0),
});

export const invoiceSchema = {
  create: Joi.object({
    customerId: Joi.string().uuid().required(),
    dueDate: Joi.date().required(),
    items: Joi.array().items(invoiceItemSchema).min(1).required(),
    notes: Joi.string().allow("", null),
    currency: Joi.string().length(3).default("SEK"),
  }),

  update: Joi.object({
    customerId: Joi.string().uuid(),
    status: Joi.string().valid("draft", "sent", "paid", "overdue", "cancelled"),
    dueDate: Joi.date(),
    items: Joi.array().items(invoiceItemSchema).min(1),
    notes: Joi.string().allow("", null),
    currency: Joi.string().length(3),
  }),
};
