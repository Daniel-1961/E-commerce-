import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CartItem = sequelize.define("CartItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cart_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // unit_price stores a price snapshot for the item at time of add-to-cart
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  });

  return CartItem;
};
