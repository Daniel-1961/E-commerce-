// src/controllers/userController.js
import bcrypt from "bcrypt";
import { User, Address } from "../models/index.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { updateProfileSchema, addressSchema } from "../validators/userValidator.js";

// Update profile (PUT /api/users/me)
export const getUserProfile=asyncHandler(async(req,res)=>{
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
   res.json({ success: true, message: "user Profile", data: user });
});
export const updateProfile = asyncHandler(async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  // If updating password
  if (req.body.password) {
    if (typeof req.body.password !== "string" || req.body.password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be >= 6 chars" });
    }
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  // Update optional fields
  if (value.name) user.name = value.name;
  if (value.email) user.email = value.email;

  await user.save();
  const safeUser = user.toJSON();
  delete safeUser.password;

  res.json({ success: true, message: "Profile updated", data: safeUser });
});

// Addresses
export const addAddress = asyncHandler(async (req, res) => {
  const { error, value } = addressSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const address = await Address.create({ user_id: req.user.id, ...value });
  res.status(201).json({ success: true, message: "Address added", data: address });
});

export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({ where: { user_id: req.user.id } });
  res.json({ success: true, data: addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await Address.findByPk(id);
  if (!address || address.user_id !== req.user.id) {
    return res.status(404).json({ success: false, message: "Address not found" });
  }
  const { error, value } = addressSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  await address.update(value);
  res.json({ success: true, message: "Address updated", data: address });
});
