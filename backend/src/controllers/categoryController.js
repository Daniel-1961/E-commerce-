// src/controllers/categoryController.js
import { Category, Product } from "../models/index.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { createCategorySchema } from "../validators/productValidator.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { error, value } = createCategorySchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const existing = await Category.findOne({ where: { name: value.name } });
  if (existing) return res.status(400).json({ success: false, message: "Category already exists" });

  const category = await Category.create(value);
  res.status(201).json({ success: true, data: category });
});
// Get all categories (public)
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    include: [{ model: Product, attributes: ["id"] }] // optional: number of products
  });
  res.json({ success: true, data: categories });
});

// Get single category
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: Product });
  if (!category) return res.status(404).json({ success: false, message: "Category not found" });
  res.json({ success: true, data: category });
});

// Update category (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Category not found" });

  const { error, value } = createCategorySchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  await category.update(value);
  res.json({ success: true, data: category });
});

// Delete category (admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Category not found" });

  await category.destroy();
  res.json({ success: true, message: "Category deleted" });
});
