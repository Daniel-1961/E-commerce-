import bcrypt from "bcryptjs";
import {
  sequelize,
  User, Category, Product, ProductImage, Cart
} from "../models/index.js";

const seed = async () => {
  await sequelize.sync({ force: true }); // force: true drops all tables and recreates them (dev only)
  // Create sample users
  const hashed = await bcrypt.hash("password123", 10);
  const user = await User.create({ name: "Demo User", email: "danieldata36@example.com", password:hashed });
  // create cart for user
  await Cart.create({ user_id: user.id });

  // categories
  const electronics = await Category.create({ name: "Electronics" });
  const books = await Category.create({ name: "Books" });

  // products
  const p1 = await Product.create({
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 99.99,
    stock: 50,
    category_id: electronics.id
  });
  await ProductImage.create({ product_id: p1.id, image_url: "backend\\public\\images\\photo_2024-07-28_22-33-05.jpg" });
  const p2 = await Product.create({
    name: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    price: 29.99,
    stock: 20,
    category_id: books.id
  });
  await ProductImage.create({ product_id: p2.id, image_url: "backend\\public\\images\\photo_2024-07-03_10-57-34.jpg" });

  console.log("✅ Seeding completed.");
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
