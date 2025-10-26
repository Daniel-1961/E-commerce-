import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
  return Product;
};
