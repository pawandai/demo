import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    in_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    article_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "st",
    },
    in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    underscored: true, // This makes Sequelize use snake_case column names
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Add virtual fields for compatibility with frontend
Product.prototype.toJSON = function () {
  const values = { ...this.get() };

  // Map snake_case DB columns to camelCase for frontend
  values.inPrice = values.in_price;
  values.articleNo = values.article_no;
  values.inStock = values.in_stock;
  values.imageUrl = values.image_url;
  values.isActive = values.is_active;
  values.createdAt = values.created_at;
  values.updatedAt = values.updated_at;

  return values;
};
