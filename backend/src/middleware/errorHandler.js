import { logger } from "../utils/logger.js";

export const errorHandler = async (fastify, options) => {
  fastify.setErrorHandler((error, request, reply) => {
    logger.error(error);

    // Handle validation errors
    if (error.validation) {
      return reply.code(400).send({
        error: "Validation error",
        details: error.validation,
      });
    }

    // Handle JWT errors
    if (
      error.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER" ||
      error.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED" ||
      error.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID"
    ) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    // Handle custom API errors
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ error: error.message });
    }

    // Default error handler
    const statusCode = error.statusCode || 500;
    const message =
      statusCode === 500 ? "Internal server error" : error.message;

    return reply.code(statusCode).send({ error: message });
  });
};
