// controllers/orderController.js

import { Order, OrderItem, Cart, CartItem, Product } from "../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Extracted from auth middleware (JWT)

    // 1️⃣ Find user's cart
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    // 2️⃣ Calculate total
    const totalAmount = cart.CartItems.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );

    // 3️⃣ Create order (use snake_case foreign key names)
    const newOrder = await Order.create({
      user_id: userId,
      total: totalAmount,
      status: "pending",
    });

    // 4️⃣ Create order items (use underscored keys)
    const orderItems = await Promise.all(
      cart.CartItems.map(async (item) => {
        return await OrderItem.create({
          order_id: newOrder.id,
          product_id: item.product_id || item.productId,
          quantity: item.quantity,
          price: item.Product.price,
        });
      })
    );

    // 5️⃣ Clear the cart
    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
      orderItems,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }],
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders." });
  }
};

// ✅ Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders." });
  }
};

// ✅ Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order." });
  }
};
