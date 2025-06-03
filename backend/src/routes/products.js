import { ProductService } from "../services/ProductService.js";
import { logger } from "../utils/logger.js";
import { validateRequest } from "../middleware/validation.js";
import { productSchema } from "../schemas/product.schema.js";

export default async function productsRoutes(fastify, options) {
  const productService = new ProductService();

  // Get all products with filtering, sorting, and pagination
  fastify.get("/", async (request, reply) => {
    try {
      const filters = request.query;
      const result = await productService.getAllProducts(filters);

      return reply.code(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error(`Get all products error: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: "Internal Server Error",
        message: "Failed to retrieve products",
      });
    }
  });

  // Get product by ID
  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return reply.code(404).send({
          success: false,
          error: "Not Found",
          message: `Product with ID ${id} not found`,
        });
      }

      return reply.code(200).send({
        success: true,
        product,
      });
    } catch (error) {
      logger.error(`Get product by ID error: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: "Internal Server Error",
        message: "Failed to retrieve product",
      });
    }
  });

  // Create new product
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate, validateRequest(productSchema.create)],
    },
    async (request, reply) => {
      return productController.createProduct(request, reply);
    }
  );

  // Bulk create products
  fastify.post(
    "/bulk",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return productController.bulkCreateProducts(request, reply);
    }
  );

  // Update product
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate, validateRequest(productSchema.update)],
    },
    async (request, reply) => {
      return productController.updateProduct(request, reply);
    }
  );

  // Delete product
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return productController.deleteProduct(request, reply);
    }
  );
}
