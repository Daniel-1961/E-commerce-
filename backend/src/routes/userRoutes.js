// routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly, ownerOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// List users - admin only
router.get("/", protect, adminOnly, getAllUsers);

// Get a single user - owner or admin
router.get("/:id", protect, ownerOrAdmin, getUserById);

// Create user (signup) - public
router.post("/", createUser);

// Update user - owner or admin
router.put("/:id", protect, ownerOrAdmin, updateUser);

// Delete user - admin only
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
