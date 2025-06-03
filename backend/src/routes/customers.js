import { CustomerController } from "../controllers/customer.controller.js";
import { validateRequest } from "../middleware/validation.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customerController = new CustomerController();

export default async function (fastify, opts) {
  // Get all customers
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return customerController.getAllCustomers(request, reply);
    }
  );

  // Get customer by ID
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return customerController.getCustomerById(request, reply);
    }
  );

  // Create customer
  fastify.post(
    "/",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest({ body: customerSchema.create }),
      ],
    },
    async (request, reply) => {
      return customerController.createCustomer(request, reply);
    }
  );

  // Update customer
  fastify.put(
    "/:id",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest({ body: customerSchema.update }),
      ],
    },
    async (request, reply) => {
      return customerController.updateCustomer(request, reply);
    }
  );

  // Delete customer
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return customerController.deleteCustomer(request, reply);
    }
  );

  // Get customer stats
  fastify.get(
    "/:id/stats",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return customerController.getCustomerStats(request, reply);
    }
  );
}
