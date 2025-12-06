// src/validators/orderValidator.js
import Joi from "joi";

export const createOrderSchema = Joi.object({
  address_id: Joi.number().integer().required(), // shipping address id (must belong to user)
  payment_method: Joi.string().valid("card","cod","wallet").default("cod"), // for MVP simple string
  // optional: coupon, notes
});
