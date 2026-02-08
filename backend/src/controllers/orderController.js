
import { sequelize, Order, OrderItem, Cart, CartItem, Product, Address } from "../models/index.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { createOrderSchema } from "../validators/orderValidator.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { error, value } = createOrderSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });

  const { address_id, payment_method } = value;

  // 1) Fetch active cart with items and products
  const cart = await Cart.findOne({
    where: { user_id: userId, status: "active" },
    include: [{ model: CartItem, include: [Product] }]
  });

  if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  // 2) Validate address belongs to user (if you use addresses)
  const address = await Address.findOne({ where: { id: address_id, user_id: userId } });
  if (!address) return res.status(400).json({ success: false, message: "Invalid shipping address" });

  // 3) Transaction: check stock, create order + items, deduct stock, clear cart / mark ordered
  const t = await sequelize.transaction();

  try {
    // Re-check stock & compute total
    let totalAmount = 0;
    for (const item of cart.CartItems) {
      const product = item.Product;
      if (!product) {
        throw { statusCode: 400, message: `Product ${item.product_id} not found` };
      }

      const desiredQty = item.quantity;

      // Use current product.price as price at purchase (or item.unit_price if you prefer snapshot)
      const priceAtPurchase = product.price ?? item.unit_price ?? 0;

      // refresh product from DB inside transaction with lock (FOR UPDATE) to be safer
      const prodRow = await Product.findByPk(product.id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!prodRow) throw { statusCode: 400, message: `Product ${product.id} not found` };

      if (prodRow.stock < desiredQty) {
        throw { statusCode: 400, message: `Insufficient stock for ${prodRow.name} (available: ${prodRow.stock})` };
      }

      totalAmount += Number((priceAtPurchase * desiredQty).toFixed(2));
    }

    // 3.1 Create Order
    const order = await Order.create({
      user_id: userId,
      address_id,
      total: totalAmount,
      status: "pending",
      payment_method
    }, { transaction: t });

    // 3.2 Create OrderItems and deduct stock
    for (const item of cart.CartItems) {
      const product = item.Product;
      const desiredQty = item.quantity;
      const priceAtPurchase = product.price ?? item.unit_price ?? 0;

      // create order item
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        quantity: desiredQty,
        price: priceAtPurchase
      }, { transaction: t });

      // deduct stock
      const prodRow = await Product.findByPk(product.id, { transaction: t, lock: t.LOCK.UPDATE });
      prodRow.stock = prodRow.stock - desiredQty;
      await prodRow.save({ transaction: t });
    }

    // 3.3 Clear cart items or mark cart as ordered
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
    cart.status = "ordered";
    await cart.save({ transaction: t });

    // Commit
    await t.commit();

    // Return created order (with items)
    const orderWithItems = await Order.findByPk(order.id, { include: [{ model: OrderItem, include: [Product] }, Address] });
    res.status(201).json({ success: true, message: "Order created", data: orderWithItems });

  } catch (err) {
    await t.rollback();
    // normalize errors thrown above
    if (err && err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.findAll({
    where: { user_id: userId },
    include: [{ model: OrderItem, include: [Product] }],
    order: [["created_at", "DESC"]]
  });
  res.json({ success: true, data: orders });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  // admin only middleware should be used on route
  const orders = await Order.findAll({
    include: [{ model: OrderItem, include: [Product] }, { model: Address }],
    order: [["created_at", "DESC"]]
  });
  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id, { include: [{ model: OrderItem, include: [Product] }, { model: Address }] });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  // allow only owner or admin (ensure route uses protect first)
  if (req.user.role !== "admin" && order.user_id !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized to view this order" });
  }

  res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

  const order = await Order.findByPk(id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  order.status = status;
  await order.save();
  res.json({ success: true, message: "Order status updated", data: order });
});
