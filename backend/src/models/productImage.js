import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductImage = sequelize.define("ProductImage", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image_url: { type: DataTypes.STRING, allowNull: true }
  });

  return ProductImage;
};
