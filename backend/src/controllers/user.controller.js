import User from "../models/User.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/errors.js";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";
import { Op } from "sequelize";

export class UserController {
  async getAllUsers(request, reply) {
    try {
      // Only admins can view all users
      if (request.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
      }

      const {
        search,
        role,
        isActive,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 20,
      } = request.query;

      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { company: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (role) {
        whereClause.role = role;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === "true";
      }

      const offset = (page - 1) * limit;

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ["password"] },
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

      return reply.send({ data: users, pagination });
    } catch (error) {
      logger.error("Get all users error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getUserById(request, reply) {
    try {
      const { id } = request.params;

      // Users can only view their own profile unless they're admin
      if (request.user.id !== id && request.user.role !== "admin") {
        throw new ApiError(403, "Access denied");
      }

      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return reply.send(user);
    } catch (error) {
      logger.error("Get user by ID error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async updateUser(request, reply) {
    try {
      const { id } = request.params;
      const updates = request.body;

      // Users can only update their own profile unless they're admin
      if (request.user.id !== id && request.user.role !== "admin") {
        throw new ApiError(403, "Access denied");
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Hash password if provided
      if (updates.password) {
        updates.password = await bcrypt.hash(
          updates.password,
          config.bcrypt.saltRounds
        );
      }

      // Only admins can change roles
      if (updates.role && request.user.role !== "admin") {
        delete updates.role;
      }

      await user.update(updates);

      // Return user without password
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      return reply.send(updatedUser);
    } catch (error) {
      logger.error("Update user error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async deleteUser(request, reply) {
    try {
      const { id } = request.params;

      // Only admins can delete users, and users can't delete themselves
      if (request.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
      }

      if (request.user.id === id) {
        throw new ApiError(400, "You cannot delete your own account");
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      await user.destroy();
      return reply.send({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      logger.error("Delete user error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getUserStats(request, reply) {
    try {
      const { id } = request.params;

      // Users can only view their own stats unless they're admin
      if (request.user.id !== id && request.user.role !== "admin") {
        throw new ApiError(403, "Access denied");
      }

      const user = await User.findByPk(id, {
        include: [
          { association: "customers", attributes: ["id"] },
          { association: "products", attributes: ["id"] },
          { association: "invoices", attributes: ["id", "total", "status"] },
        ],
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const stats = {
        totalCustomers: user.customers?.length || 0,
        totalProducts: user.products?.length || 0,
        totalInvoices: user.invoices?.length || 0,
        totalRevenue:
          user.invoices?.reduce(
            (sum, invoice) => sum + Number.parseFloat(invoice.total || 0),
            0
          ) || 0,
        paidInvoices:
          user.invoices?.filter((inv) => inv.status === "paid").length || 0,
        pendingInvoices:
          user.invoices?.filter((inv) => inv.status === "sent").length || 0,
        overdueInvoices:
          user.invoices?.filter((inv) => inv.status === "overdue").length || 0,
      };

      return reply.send(stats);
    } catch (error) {
      logger.error("Get user stats error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
