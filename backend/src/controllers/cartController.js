import { Cart, CartItem, Product } from "../models/index.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { addToCartSchema, updateCartItemSchema } from "../validators/cartValidator.js";
import { Op } from "sequelize";
const findOrCreateActiveCart = async (userId) => {
  let cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });
  if (!cart) {
    cart = await Cart.create({ user_id: userId, status: "active" });
  }
  return cart;
};

// GET /api/carts/my-cart
export const getMyCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({
    where: { user_id: userId, status: "active" },
    include: [{ model: CartItem, include: [Product] }]
  });

  if (!cart) {
    return res.json({ success: true, data: { items: [], subtotal: 0 } });
  }
  // calculate subtotal
  let subtotal = 0;
  const items = cart.CartItems.map(item => {
    const product = item.Product;
    const unit_price = item.unit_price ?? (product ? product.price : 0);
    const line = {
      id: item.id,
      product_id: item.product_id,
      product_name: product ? product.name : null,
      quantity: item.quantity,
      unit_price,
      line_total: Number((unit_price * item.quantity).toFixed(2))
    };
    subtotal += line.line_total;
    return line;
  });

  res.json({ success: true, data: { id: cart.id, items, subtotal: Number(subtotal.toFixed(2)) } });
});

// POST /api/carts/add
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { error, value } = addToCartSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const { product_id, quantity } = value;

  // Check product exists and stock
  const product = await Product.findByPk(product_id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: `Only ${product.stock} units available` });
  }
  // Ensure cart exists
  const cart = await findOrCreateActiveCart(userId);

  // If item exists, increment quantity (but cap at stock)
  let cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id } });
//Needs refarctoring the code 
  if (cartItem) {
    const newQty = cartItem.quantity + quantity;
    if (newQty > product.stock) {
      return res.status(400).json({ success: false, message: `Cannot add ${quantity}. Only ${product.stock - cartItem.quantity} more available` });
    }
    cartItem.quantity = newQty;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      cart_id: cart.id,
      product_id,
      quantity,
      unit_price: product.price // snapshot
    });
  }

  return res.status(201).json({ success: true, message: "Added to cart", data: { cartItemId: cartItem.id } });
});

// PATCH /api/carts/update/:itemId
export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { error, value } = updateCartItemSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const { quantity } = value;

  const cartItem = await CartItem.findByPk(itemId, { include: [Product, { model: Cart, where: { user_id: userId, status: 'active' } }] });
  if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });

  const product = cartItem.Product;
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  // If quantity = 0 -> remove item
  if (quantity === 0) {
    await cartItem.destroy();
    return res.json({ success: true, message: "Item removed from cart" });
  }

  // Check stock limit
  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: `Only ${product.stock} units available` });
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  res.json({ success: true, message: "Cart item updated", data: { id: cartItem.id, quantity: cartItem.quantity } });
});

// DELETE /api/carts/item/:itemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  const cartItem = await CartItem.findByPk(itemId, { include: [{ model: Cart, where: { user_id: userId, status: 'active' } }] });
  if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });

  await cartItem.destroy();
  res.json({ success: true, message: "Item removed" });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });
  if (!cart) return res.json({ success: true, message: "Cart is already empty" });

  await CartItem.destroy({ where: { cart_id: cart.id } });
  res.json({ success: true, message: "Cart cleared" });
});
