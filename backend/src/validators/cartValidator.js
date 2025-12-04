// src/validators/cartValidator.js
import Joi from "joi";

export const addToCartSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).default(1)
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required() // 0 means remove
});
