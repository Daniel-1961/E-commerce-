import express from 'express'
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    getUserCart,
    addToCart,
    removeFromCart,

}from '../controllers/cartController.js';
const router=express.Router();
router.get("/", protect, getUserCart);
router.post("/", protect, addToCart);
router.delete("/:id", protect, removeFromCart);
export default router;
