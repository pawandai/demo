import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

const Terms = sequelize.define(
  "Terms",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    language: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        isIn: [["sv", "en"]],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "1.0.0",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "terms",
    indexes: [
      {
        fields: ["language", "isActive"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export default Terms;
