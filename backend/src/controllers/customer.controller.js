import Customer from "../models/Customer.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/errors.js";
import { Op } from "sequelize";

export class CustomerController {
  async getAllCustomers(request, reply) {
    try {
      const {
        search,
        country,
        isActive,
        sortBy = "name",
        sortOrder = "ASC",
        page = 1,
        limit = 20,
      } = request.query;

      const whereClause = { userId: request.user.id };

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { organizationNumber: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (country) {
        whereClause.country = country;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === "true";
      }

      const offset = (page - 1) * limit;

      const { count, rows: customers } = await Customer.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        include: [
          {
            association: "invoices",
            attributes: ["id", "total", "status"],
          },
        ],
      });

      const pagination = {
        total: count,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit),
      };

      return reply.send({ data: customers, pagination });
    } catch (error) {
      logger.error("Get all customers error:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getCustomerById(request, reply) {
    try {
      const { id } = request.params;

      const customer = await Customer.findOne({
        where: { id, userId: request.user.id },
        include: [
          {
            association: "invoices",
            attributes: [
              "id",
              "invoiceNumber",
              "total",
              "status",
              "issueDate",
              "dueDate",
            ],
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }

      return reply.send(customer);
    } catch (error) {
      logger.error("Get customer by ID error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async createCustomer(request, reply) {
    try {
      const customerData = { ...request.body, userId: request.user.id };

      const customer = await Customer.create(customerData);
      return reply.code(201).send(customer);
    } catch (error) {
      logger.error("Create customer error:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async updateCustomer(request, reply) {
    try {
      const { id } = request.params;
      const updates = request.body;

      const customer = await Customer.findOne({
        where: { id, userId: request.user.id },
      });

      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }

      await customer.update(updates);
      return reply.send(customer);
    } catch (error) {
      logger.error("Update customer error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async deleteCustomer(request, reply) {
    try {
      const { id } = request.params;

      const customer = await Customer.findOne({
        where: { id, userId: request.user.id },
      });

      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }

      await customer.destroy();
      return reply.send({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      logger.error("Delete customer error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getCustomerStats(request, reply) {
    try {
      const { id } = request.params;

      const customer = await Customer.findOne({
        where: { id, userId: request.user.id },
        include: [
          {
            association: "invoices",
            attributes: ["total", "status"],
          },
        ],
      });

      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }

      const stats = {
        totalInvoices: customer.invoices?.length || 0,
        totalRevenue:
          customer.invoices?.reduce(
            (sum, inv) => sum + Number.parseFloat(inv.total || 0),
            0
          ) || 0,
        paidInvoices:
          customer.invoices?.filter((inv) => inv.status === "paid").length || 0,
        pendingInvoices:
          customer.invoices?.filter((inv) => inv.status === "sent").length || 0,
        overdueInvoices:
          customer.invoices?.filter((inv) => inv.status === "overdue").length ||
          0,
      };

      return reply.send(stats);
    } catch (error) {
      logger.error("Get customer stats error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
