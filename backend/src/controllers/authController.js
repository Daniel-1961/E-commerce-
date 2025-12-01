// src/controllers/authController.js
import bcrypt from "bcrypt";
import { User, Address } from "../models/index.js";
import { generateToken } from "../../utils/token.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

// Register
export const registerUser = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const { name, email, password } = value;

  const exist = await User.findOne({ where: { email } });
  if (exist) return res.status(400).json({ success: false, message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "customer" });

  // Option: create empty cart or default address elsewhere

  const token = generateToken({ id: user.id, role: user.role });

  // Exclude password in response
  const safeUser = user.toJSON();
  delete safeUser.password;

  res.status(201).json({ success: true, message: "User created", data: { user: safeUser, token } });
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const { email, password } = value;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const token = generateToken({ id: user.id, role: user.role });
  const safeUser = user.toJSON();
  delete safeUser.password;

  res.json({ success: true, message: "Login successful", data: { user: safeUser, token } });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  const addresses = await Address.findAll({ where: { user_id: user.id } });
  res.json({ success: true, data: { user, addresses } });
});
