const { DataTypes } = require("sequelize");
const { sequelize } = require("../mysql");

const Subc = sequelize.define(
  "Barcodes",
  {
    urlId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      defaultValue: "default",
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    longUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Barcodes",
    timestamps: false,
  }
);

module.exports = Subc;
