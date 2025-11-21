import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, createOrder); // User checkout
router.get("/", protect, adminOnly, getAllOrders); // Admin view all
router.get("/my-orders", protect, getUserOrders); // User view own
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router; 
