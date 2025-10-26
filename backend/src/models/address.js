import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Address = sequelize.define("Address", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    street: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    postal_code: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING }
  });

  return Address;
};
