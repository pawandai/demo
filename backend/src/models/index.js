import { sequelize } from "../database/connection.js";
import User from "./User.js";
import Terms from "./Terms.js";
import Product from "./Product.js";
import Customer from "./Customer.js";
import Invoice from "./Invoice.js";
import InvoiceItem from "./InvoiceItem.js";

// Define associations
User.hasMany(Customer, { foreignKey: "userId", as: "customers" });
Customer.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Invoice, { foreignKey: "userId", as: "invoices" });
Invoice.belongsTo(User, { foreignKey: "userId", as: "user" });

Customer.hasMany(Invoice, { foreignKey: "customerId", as: "invoices" });
Invoice.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId", as: "items" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

Product.hasMany(InvoiceItem, { foreignKey: "productId", as: "invoiceItems" });
InvoiceItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Terms, Product, Customer, Invoice, InvoiceItem };
