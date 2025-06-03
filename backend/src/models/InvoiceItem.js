import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

const InvoiceItem = sequelize.define(
  "InvoiceItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "invoices",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "products",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 25.0, // Swedish VAT
    },
    lineTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "invoice_items",
    indexes: [
      {
        fields: ["invoiceId"],
      },
      {
        fields: ["productId"],
      },
    ],
  }
);

export default InvoiceItem;
