import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { config } from "./src/config/index.js";
import { connectDatabase } from "./src/database/connection.js";
import { runSeeders } from "./src/database/seeders/index.js";
import { logger } from "./src/utils/logger.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { authMiddleware } from "./src/middleware/auth.js";
import { addVersionToTerms } from "./src/database/migrations/add-version-to-terms.js";

// Import routes
import authRoutes from "./src/routes/auth.js";
import termsRoutes from "./src/routes/terms.js";
import productsRoutes from "./src/routes/products.js";
import usersRoutes from "./src/routes/users.js";
import customersRoutes from "./src/routes/customers.js";
import invoicesRoutes from "./src/routes/invoices.js";

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty" }
        : undefined,
  },
});

// Register plugins
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

await fastify.register(cors, {
  origin: config.cors.origin,
  credentials: true,
});

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

await fastify.register(jwt, {
  secret: config.jwt.secret,
  sign: {
    expiresIn: config.jwt.expiresIn,
  },
});

await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Register middleware - update to use fastify.register
await fastify.register(authMiddleware);
await fastify.register(errorHandler);

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Register routes with proper prefixes
fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(termsRoutes, { prefix: "/api/terms" });
fastify.register(productsRoutes, { prefix: "/api/products" });
fastify.register(usersRoutes, { prefix: "/api/users" });
fastify.register(customersRoutes, { prefix: "/api/customers" });
fastify.register(invoicesRoutes, { prefix: "/api/invoices" });

// Add a route debug log to see all registered routes
fastify.addHook("onReady", () => {
  // Print all registered routes for debugging
  console.log("Registered Routes:");
  fastify.printRoutes();
});

// Start server
const start = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Run database migrations
    await addVersionToTerms();

    // Run seeders
    await runSeeders();

    // Start server
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });

    logger.info(
      `Server running on http://${config.server.host}:${config.server.port}`
    );
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
