import { DataTypes } from "sequelize";

export default (sequelize) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false } // price at time of purchase
  });

  return OrderItem;
};
