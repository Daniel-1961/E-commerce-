import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    // status indicates whether the cart is active (open) or ordered (checked out)
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "active" }
    // createdAt/updatedAt handled by timestamps
  });

  return Cart;
};
