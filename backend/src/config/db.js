// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false, // set to console.log for dev verbose SQL
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true,   // use snake_case column names by default
    timestamps: true     // createdAt and updatedAt automatically
  }
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection established.");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
    process.exit(1);
  }
};
