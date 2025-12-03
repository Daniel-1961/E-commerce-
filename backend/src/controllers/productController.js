// src/controllers/productController.js
import { Product, ProductImage, Category } from "../models/index.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidator.js";
import { Op } from "sequelize";

// Admin: create product (images optional)
export const createProduct = asyncHandler(async (req, res) => {
  const { error, value } = createProductSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  // ensure category exists
  const cat = await Category.findByPk(value.category_id);
  if (!cat) return res.status(400).json({ success: false, message: "Category not found" });

  const { images, ...productData } = value;
  const product = await Product.create(productData);

  if (images && Array.isArray(images)) {
    const imgPromises = images.map(url => ProductImage.create({ product_id: product.id, image_url: url }));
    await Promise.all(imgPromises);
  }

  const full = await Product.findByPk(product.id, { include: [ProductImage, Category] });
  res.status(201).json({ success: true, data: full });
});

// Admin: update
export const updateProduct = asyncHandler(async (req, res) => {
  const { error, value } = updateProductSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  // if category_id present ensure category exists
  if (value.category_id) {
    const c = await Category.findByPk(value.category_id);
    if (!c) return res.status(400).json({ success: false, message: "Category not found" });
  }

  const { images, ...fields } = value;
  await product.update(fields);

  if (images) {
    // simple strategy: delete old images and recreate from provided array
    await ProductImage.destroy({ where: { product_id: product.id } });
    const imgPromises = images.map(url => ProductImage.create({ product_id: product.id, image_url: url }));
    await Promise.all(imgPromises);
  }

  const full = await Product.findByPk(product.id, { include: [ProductImage, Category] });
  res.json({ success: true, data: full });
});

// Admin: delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  await product.destroy();
  res.json({ success: true, message: "Product deleted" });
});

// Public: fetch products (pagination, filter, search)
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 12, 100); // safe limit
  const offset = (page - 1) * limit;

  const where = {};

  // filter by category_id or category name (category parameter)
  if (req.query.category_id) where.category_id = req.query.category_id;
  if (req.query.min_price) where.price = { ...(where.price || {}), [Op.gte]: parseFloat(req.query.min_price) };
  if (req.query.max_price) where.price = { ...(where.price || {}), [Op.lte]: parseFloat(req.query.max_price) };

  // search
  if (req.query.q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${req.query.q}%` } },
      { description: { [Op.iLike]: `%${req.query.q}%` } }
    ];
  }

  const { rows: products, count } = await Product.findAndCountAll({
    where,
    include: [ProductImage, Category],
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  res.json({
    success: true,
    meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    data: products
  });
});

// Public: get single product by id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: [ProductImage, Category] });
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, data: product });
});
