// src/models/index.js
import UserModel from "./user.js";
import AddressModel from "./address.js";
import CategoryModel from "./category.js";
import ProductModel from "./product.js";
import ProductImageModel from "./productImage.js";
import CartModel from "./cart.js";
import CartItemModel from "./cartItem.js";
import OrderModel from "./order.js";
import OrderItemModel from "./orderItem.js";

import { sequelize } from "../config/db.js";

const User = UserModel(sequelize);
const Address = AddressModel(sequelize);
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const ProductImage = ProductImageModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);

/* ----- Associations ----- */

// Users & Addresses
User.hasMany(Address, { foreignKey: "user_id", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "user_id" });

// User & Cart (one cart per user typical)
User.hasOne(Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// Cart & CartItem
Cart.hasMany(CartItem, { foreignKey: "cart_id", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// Product & CartItem
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// Category & Product
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

// Product & ProductImage
Product.hasMany(ProductImage, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

// Orders
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// Order -> Address (shipping address)
Order.belongsTo(Address, { foreignKey: "address_id" });

// Order & OrderItem (junction)
Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Product & OrderItem
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

export {
  sequelize,
  User,
  Address,
  Category,
  Product,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem
};
