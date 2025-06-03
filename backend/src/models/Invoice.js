import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "sent", "paid", "overdue", "cancelled"),
      defaultValue: "draft",
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "SEK",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "invoices",
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["customerId"],
      },
      {
        fields: ["invoiceNumber"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["issueDate"],
      },
      {
        fields: ["dueDate"],
      },
    ],
  }
);

export default Invoice;
