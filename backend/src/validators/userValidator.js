// src/validators/userValidator.js
import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  
  // password handled separately
});

export const addressSchema = Joi.object({
  street: Joi.string().optional(),
  city: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  country: Joi.string().optional(),
});
