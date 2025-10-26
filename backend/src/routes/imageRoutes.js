import express from "express";
import { getAllImages, createImage } from "../controllers/imageController.js";

const router = express.Router();

router.get("/", getAllImages);
router.post("/", createImage);

export default router;
