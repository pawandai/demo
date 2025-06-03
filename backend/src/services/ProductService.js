import { Op } from "sequelize";
import { Product } from "../models/Product.js";
import { logger } from "../utils/logger.js";

export class ProductService {
  /**
   * Get all products with filtering, sorting, and pagination
   */
  async getAllProducts(filters = {}) {
    try {
      const {
        search = "",
        category = "",
        minPrice = "",
        maxPrice = "",
        inStock = "",
        sortBy = "name", // Use 'name' as it's the frontend's expected field
        sortOrder = "ASC",
        page = 1,
        limit = 20,
      } = filters;

      // Build filter conditions
      const whereConditions = {};

      // Search by name, articleNo, or description
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { articleNo: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Filter by category
      if (category) {
        whereConditions.category = category;
      }

      // Filter by price range
      if (minPrice) {
        whereConditions.price = {
          ...whereConditions.price,
          [Op.gte]: parseFloat(minPrice),
        };
      }

      if (maxPrice) {
        whereConditions.price = {
          ...whereConditions.price,
          [Op.lte]: parseFloat(maxPrice),
        };
      }

      // Filter by stock
      if (inStock === "true") {
        whereConditions.inStock = { [Op.gt]: 0 };
      } else if (inStock === "false") {
        whereConditions.inStock = 0;
      }

      // Calculate pagination
      const offset = (page - 1) * limit;

      // Map frontend sortBy values to database column names
      const sortMapping = {
        name: "name",
        price: "price",
        inStock: "in_stock",
        articleNo: "article_no",
        createdAt: "created_at",
      };

      // Determine the actual column to sort by
      const actualSortBy = sortMapping[sortBy] || "name";

      // Query products
      const { count, rows } = await Product.findAndCountAll({
        where: whereConditions,
        order: [[actualSortBy, sortOrder]],
        offset,
        limit: parseInt(limit),
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error(`Error in ProductService.getAllProducts: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    try {
      const product = await Product.findByPk(id);
      return product;
    } catch (error) {
      logger.error(`Error in ProductService.getProductById: ${error.message}`);
      throw error;
    }
  }

  // Get product categories
  async getCategories() {
    try {
      const categories = await Product.findAll({
        attributes: ["category"],
        group: ["category"],
        where: {
          category: {
            [Op.not]: null,
            [Op.ne]: "",
          },
        },
      });

      return {
        data: categories.map((item) => item.category).filter(Boolean),
      };
    } catch (error) {
      logger.error(`Error in ProductService.getCategories: ${error.message}`);
      throw error;
    }
  }
}
