import express from 'express'
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart

}from '../controllers/cartController.js';

const router = express.Router();

router.get("/my-cart", protect, getMyCart);
router.post("/add", protect, addToCart);
router.patch("/update/:itemId", protect, updateCartItem);
router.delete("/item/:itemId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);
export default router;
