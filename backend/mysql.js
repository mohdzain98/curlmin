const { Sequelize } = require("sequelize");
require("dotenv").config();
const db = process.env.MYSQL_DB;
const dbname = process.env.MYSQL_DB_NAME;
const pass = process.env.MYSQL_PASS;
const host = process.env.MYSQL_HOST;

const sequelize = new Sequelize(db, dbname, pass, {
  host: host,
  dialect: "mysql", // Specify the database dialect
  logging: false,
  timezone: "+05:30",
});

sequelize
  .authenticate()
  .then(() => console.log("MySQL Database connected!"))
  .catch((err) => console.error("Unable to connect to the sql database:", err));

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: false }); // Use alter for updates, or force: true to drop and recreate tables
    console.log("MySQL Database synchronized!");
  } catch (error) {
    console.error("Error syncing sql database:", error);
  }
};
module.exports = { sequelize, syncDB };
