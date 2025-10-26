import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
    // createdAt/updatedAt handled by timestamps
  });

  return Cart;
};
