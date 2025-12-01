import express from 'express';
import{
  updateProfile,
  addAddress,
  listAddresses,
  updateAddress,
} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";
const router=express.Router();
router.put("/me", protect, updateProfile);
router.post("/addresses", protect, addAddress);
router.get("/addresses", protect, listAddresses);
router.put("/addresses/:id", protect, updateAddress);
export default router;
