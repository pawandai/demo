import { AuthController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.js";
import { authSchema } from "../schemas/auth.schema.js";

const authController = new AuthController();

export default async function authRoutes(fastify, options) {
  // Login route
  fastify.post(
    "/login",
    {
      preHandler: [validateRequest({ body: authSchema.login })],
    },
    async (request, reply) => {
      return authController.login(request, reply);
    }
  );

  // Register route - keep only one registration route
  fastify.post(
    "/register",
    {
      preHandler: [validateRequest({ body: authSchema.register })],
    },
    async (request, reply) => {
      return authController.register(request, reply);
    }
  );

  // Get current user
  fastify.get(
    "/me",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      return { user: request.user };
    }
  );

  // Logout route
  fastify.post("/logout", async (request, reply) => {
    // ...existing code...
  });
}
