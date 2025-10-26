// src/dbSync.js
import { testConnection, sequelize } from "./config/db.js";
import * as models from "./models/index.js";

const syncDb = async () => {
  await testConnection();
  // { alter: true } updates tables to match models without dropping data (useful in dev)
  await sequelize.sync({ alter: true });
  console.log("✅ All models were synchronized successfully.");
  process.exit(0);
};

syncDb().catch(err => {
  console.error(err);
  process.exit(1);
});
