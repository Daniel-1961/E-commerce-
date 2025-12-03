// src/validators/productValidator.js
import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("", null),
});

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  category_id: Joi.number().integer().required(),
  images: Joi.array().items(Joi.string().uri()).optional() // array of image URLs
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().allow("", null).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  category_id: Joi.number().integer().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});
