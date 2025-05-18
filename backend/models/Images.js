const { DataTypes } = require("sequelize");
const { sequelize } = require("../mysql");

const Image = sequelize.define(
  "Image",
  {
    image_id: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      defaultValue: "default",
    },
    file_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    passval: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPermanent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    download: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "images",
    timestamps: true, // Auto adds createdAt/updatedAt
  }
);

module.exports = Image;
