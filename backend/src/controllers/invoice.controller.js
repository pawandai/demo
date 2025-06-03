import Invoice from "../models/Invoice.js";
import InvoiceItem from "../models/InvoiceItem.js";
import Customer from "../models/Customer.js";
import { Product } from "../models/Product.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/errors.js";
import sequelize, { Op } from "sequelize";

export class InvoiceController {
  async getAllInvoices(request, reply) {
    try {
      const {
        search,
        status,
        customerId,
        dateFrom,
        dateTo,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 20,
      } = request.query;

      const whereClause = { userId: request.user.id };

      if (search) {
        whereClause[Op.or] = [{ invoiceNumber: { [Op.iLike]: `%${search}%` } }];
      }

      if (status) {
        whereClause.status = status;
      }

      if (customerId) {
        whereClause.customerId = customerId;
      }

      if (dateFrom) {
        whereClause.issueDate = {
          ...whereClause.issueDate,
          [Op.gte]: new Date(dateFrom),
        };
      }

      if (dateTo) {
        whereClause.issueDate = {
          ...whereClause.issueDate,
          [Op.lte]: new Date(dateTo),
        };
      }

      const offset = (page - 1) * limit;

      const { count, rows: invoices } = await Invoice.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
          {
            model: InvoiceItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "productName", "unit"], // Changed from 'name' to 'productName'
              },
            ],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
      });

      const pagination = {
        total: count,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit),
      };

      return reply.send({ data: invoices, pagination });
    } catch (error) {
      logger.error("Get all invoices error:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getInvoiceById(request, reply) {
    try {
      const { id } = request.params;

      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.id },
        include: [
          {
            model: Customer,
            as: "customer",
          },
          {
            model: InvoiceItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "productName", "unit"], // Changed from 'name' to 'productName'
              },
            ],
          },
        ],
      });

      if (!invoice) {
        throw new ApiError(404, "Invoice not found");
      }

      return reply.send(invoice);
    } catch (error) {
      logger.error("Get invoice by ID error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async createInvoice(request, reply) {
    const transaction = await sequelize.transaction();

    try {
      const { customerId, items, dueDate, notes, ...invoiceData } =
        request.body;

      // Generate invoice number
      const lastInvoice = await Invoice.findOne({
        where: { userId: request.user.id },
        order: [["createdAt", "DESC"]],
        transaction,
      });

      const invoiceNumber = this.generateInvoiceNumber(
        lastInvoice?.invoiceNumber
      );

      // Calculate totals
      let subtotal = 0;
      let taxAmount = 0;

      for (const item of items) {
        const lineTotal = item.quantity * item.unitPrice;
        const lineTax = (lineTotal * item.taxRate) / 100;
        subtotal += lineTotal;
        taxAmount += lineTax;
      }

      const total = subtotal + taxAmount;

      // Create invoice
      const invoice = await Invoice.create(
        {
          ...invoiceData,
          userId: request.user.id,
          customerId,
          invoiceNumber,
          dueDate: new Date(dueDate),
          subtotal,
          taxAmount,
          total,
          notes,
        },
        { transaction }
      );

      // Create invoice items
      for (const item of items) {
        const lineTotal = item.quantity * item.unitPrice;
        await InvoiceItem.create(
          {
            invoiceId: invoice.id,
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate || 25.0,
            lineTotal,
          },
          { transaction }
        );
      }

      await transaction.commit();

      // Fetch complete invoice with relations
      const completeInvoice = await Invoice.findByPk(invoice.id, {
        include: [
          { model: Customer, as: "customer" },
          {
            model: InvoiceItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      return reply.code(201).send(completeInvoice);
    } catch (error) {
      await transaction.rollback();
      logger.error("Create invoice error:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async updateInvoice(request, reply) {
    const transaction = await sequelize.transaction();

    try {
      const { id } = request.params;
      const { items, ...updates } = request.body;

      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.id },
        transaction,
      });

      if (!invoice) {
        throw new ApiError(404, "Invoice not found");
      }

      // Update invoice items if provided
      if (items) {
        // Delete existing items
        await InvoiceItem.destroy({
          where: { invoiceId: id },
          transaction,
        });

        // Recalculate totals
        let subtotal = 0;
        let taxAmount = 0;

        for (const item of items) {
          const lineTotal = item.quantity * item.unitPrice;
          const lineTax = (lineTotal * item.taxRate) / 100;
          subtotal += lineTotal;
          taxAmount += lineTax;

          await InvoiceItem.create(
            {
              invoiceId: id,
              productId: item.productId,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate || 25.0,
              lineTotal,
            },
            { transaction }
          );
        }

        updates.subtotal = subtotal;
        updates.taxAmount = taxAmount;
        updates.total = subtotal + taxAmount;
      }

      await invoice.update(updates, { transaction });
      await transaction.commit();

      // Fetch updated invoice with relations
      const updatedInvoice = await Invoice.findByPk(id, {
        include: [
          { model: Customer, as: "customer" },
          {
            model: InvoiceItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      return reply.send(updatedInvoice);
    } catch (error) {
      await transaction.rollback();
      logger.error("Update invoice error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async deleteInvoice(request, reply) {
    try {
      const { id } = request.params;

      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.id },
      });

      if (!invoice) {
        throw new ApiError(404, "Invoice not found");
      }

      await invoice.destroy();
      return reply.send({
        success: true,
        message: "Invoice deleted successfully",
      });
    } catch (error) {
      logger.error("Delete invoice error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async markInvoiceAsPaid(request, reply) {
    try {
      const { id } = request.params;

      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.id },
      });

      if (!invoice) {
        throw new ApiError(404, "Invoice not found");
      }

      await invoice.update({
        status: "paid",
        paidAt: new Date(),
      });

      return reply.send(invoice);
    } catch (error) {
      logger.error("Mark invoice as paid error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async sendInvoice(request, reply) {
    try {
      const { id } = request.params;

      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.id },
      });

      if (!invoice) {
        throw new ApiError(404, "Invoice not found");
      }

      await invoice.update({ status: "sent" });

      // Here you would integrate with email service to send the invoice
      // For now, we'll just update the status

      return reply.send({
        success: true,
        message: "Invoice sent successfully",
      });
    } catch (error) {
      logger.error("Send invoice error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  generateInvoiceNumber(lastInvoiceNumber) {
    if (!lastInvoiceNumber) {
      return "INV-001";
    }

    const match = lastInvoiceNumber.match(/INV-(\d+)/);
    if (match) {
      const nextNumber = Number.parseInt(match[1]) + 1;
      return `INV-${nextNumber.toString().padStart(3, "0")}`;
    }

    return "INV-001";
  }
}
