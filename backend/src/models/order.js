import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM("pending","paid","shipped","delivered","cancelled"),
      defaultValue: "pending"
    },
    total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.0 }
  });

  return Order;
};
