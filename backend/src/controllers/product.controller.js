import Product from "../models/Product.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/errors.js";
import sequelize, { Op } from "sequelize";

export class ProductController {
  async getAllProducts(request, reply) {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 50,
      } = request.query;

      // Build filter conditions
      const whereClause = {};

      // Add userId filter if authenticated
      if (request.user) {
        whereClause.userId = request.user.id;
      }

      // Search filter
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { articleNo: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Category filter
      if (category) {
        whereClause.category = category;
      }

      // Price range filter
      if (minPrice !== undefined) {
        whereClause.price = { ...whereClause.price, [Op.gte]: minPrice };
      }
      if (maxPrice !== undefined) {
        whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };
      }

      // Stock filter
      if (inStock === "true") {
        whereClause.inStock = { [Op.gt]: 0 };
      } else if (inStock === "false") {
        whereClause.inStock = 0;
      }

      // Validate sort parameters
      const validSortFields = [
        "name",
        "price",
        "inStock",
        "createdAt",
        "articleNo",
      ];
      const validSortOrders = ["ASC", "DESC"];

      const actualSortBy = validSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";
      const actualSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : "DESC";

      // Pagination
      const offset = (page - 1) * limit;

      // Execute query
      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        order: [[actualSortBy, actualSortOrder]],
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(count / limit);
      const hasMore = page < totalPages;
      const pagination = {
        total: count,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages,
        hasMore,
      };

      return reply.send({
        data: products,
        pagination,
      });
    } catch (error) {
      logger.error("Get all products error:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getProductById(request, reply) {
    try {
      const { id } = request.params;

      const product = await Product.findByPk(id);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      // Check if user has access to this product
      if (request.user && product.userId !== request.user.id) {
        throw new ApiError(
          403,
          "You don't have permission to access this product"
        );
      }

      return reply.send(product);
    } catch (error) {
      logger.error("Get product by ID error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async createProduct(request, reply) {
    try {
      const productData = request.body;

      // Add userId from authenticated user
      if (request.user) {
        productData.userId = request.user.id;
      }

      // Check if article number already exists for this user
      const existingProduct = await Product.findOne({
        where: {
          userId: productData.userId,
          articleNo: productData.articleNo,
        },
      });

      if (existingProduct) {
        throw new ApiError(
          409,
          "A product with this article number already exists"
        );
      }

      const product = await Product.create(productData);
      return reply.code(201).send(product);
    } catch (error) {
      logger.error("Create product error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async updateProduct(request, reply) {
    try {
      const { id } = request.params;
      const updates = request.body;

      // Find product
      const product = await Product.findByPk(id);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      // Check if user has permission to update this product
      if (request.user && product.userId !== request.user.id) {
        throw new ApiError(
          403,
          "You don't have permission to update this product"
        );
      }

      // Check if updating to an article number that already exists
      if (updates.articleNo && updates.articleNo !== product.articleNo) {
        const existingProduct = await Product.findOne({
          where: {
            userId: product.userId,
            articleNo: updates.articleNo,
            id: { [Op.ne]: id },
          },
        });

        if (existingProduct) {
          throw new ApiError(
            409,
            "A product with this article number already exists"
          );
        }
      }

      // Update product
      await product.update(updates);
      return reply.send(product);
    } catch (error) {
      logger.error("Update product error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async deleteProduct(request, reply) {
    try {
      const { id } = request.params;

      // Find product
      const product = await Product.findByPk(id);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      // Check if user has permission to delete this product
      if (request.user && product.userId !== request.user.id) {
        throw new ApiError(
          403,
          "You don't have permission to delete this product"
        );
      }

      // Delete product
      await product.destroy();
      return reply.send({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      logger.error("Delete product error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getProductCategories(request, reply) {
    try {
      // Get distinct categories
      const categories = await Product.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("category")), "category"],
        ],
        where: {
          category: {
            [Op.ne]: null,
          },
        },
        raw: true,
      });

      return reply.send(categories.map((c) => c.category).filter(Boolean));
    } catch (error) {
      logger.error("Get product categories error:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async bulkCreateProducts(request, reply) {
    try {
      const products = request.body;

      if (!Array.isArray(products)) {
        throw new ApiError(400, "Request body must be an array of products");
      }

      // Add userId to all products
      const productsWithUserId = products.map((product) => ({
        ...product,
        userId: request.user.id,
      }));

      const createdProducts = await Product.bulkCreate(productsWithUserId, {
        validate: true,
        returning: true,
      });

      return reply.code(201).send(createdProducts);
    } catch (error) {
      logger.error("Bulk create products error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
