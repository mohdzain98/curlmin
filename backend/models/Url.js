const { DataTypes } = require("sequelize");
const { sequelize } = require("../mysql");

const URL = sequelize.define(
  "URL",
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
    pass: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    passval: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPermanent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "urls",
    timestamps: false,
  }
);

module.exports = URL;
