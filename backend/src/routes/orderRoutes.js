import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, createOrder); // User checkout
router.get("/my-order",protect,getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/", protect, adminOnly, getAllOrders); // Admin view all
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router; 
