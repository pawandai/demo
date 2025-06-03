import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

export const Term = sequelize.define(
  "Term",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    language: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
      validate: {
        isIn: [["en", "sv"]],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING(10),
      defaultValue: "1.0",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "terms",
    timestamps: true,
  }
);
