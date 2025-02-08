const { DataTypes } = require("sequelize");
const { sequelize } = require("../mysql");

const Sust = sequelize.define(
  "curltag",
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
    tableName: "curltag",
    timestamps: false,
  }
);

module.exports = Sust;
