// server.js
import express from "express";
import { sequelize, testConnection } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());

// Routes


// After user routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use(errorHandler);
testConnection()


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
