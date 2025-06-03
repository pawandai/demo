import { UserController } from "../controllers/user.controller.js";

const userController = new UserController();

export default async function (fastify, opts) {
  // Get all users (admin only)
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return userController.getAllUsers(request, reply);
    }
  );

  // Get user by ID
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return userController.getUserById(request, reply);
    }
  );

  // Update user
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return userController.updateUser(request, reply);
    }
  );

  // Delete user (admin only)
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return userController.deleteUser(request, reply);
    }
  );

  // Get user stats
  fastify.get(
    "/:id/stats",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return userController.getUserStats(request, reply);
    }
  );
}
