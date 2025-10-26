import { ProductImage, Product } from "../models/index.js";
import ProductImage from "../models/productImage.js";

export const getAllImages = async (req, res) => {
  try {
    const images = await ProductImage.findAll({ include: Product });
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createImage = async (req, res) => {
  try {
    const image = await ProductImage.create(req.body);
    res.status(201).json(image);
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(500).json({ message: "Server error" });
  }
};
