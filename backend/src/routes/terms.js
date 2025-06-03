import { TermsController } from "../controllers/terms.controller.js";
import { validateRequest } from "../middleware/validation.js";
import { termsSchema } from "../schemas/terms.schema.js";
import { TermService } from "../services/TermService.js";
import { logger } from "../utils/logger.js";

const termsController = new TermsController();
const termService = new TermService();

export default async function (fastify, opts) {
  // Get terms by language
  fastify.get("/:language", async (request, reply) => {
    try {
      const { language } = request.params;

      // Validate language parameter
      if (!language || !["en", "sv"].includes(language.toLowerCase())) {
        return reply.code(400).send({
          error: "Invalid language parameter",
          message: 'Language must be "en" or "sv"',
        });
      }

      const terms = await termService.getByLanguage(language.toLowerCase());

      if (!terms) {
        return reply.code(404).send({
          error: "Terms not found",
          message: `Terms for language "${language}" not found`,
        });
      }

      // Ensure response has consistent structure
      const response = {
        id: terms.id,
        language: terms.language,
        content: terms.content,
        version: terms.version || "1.0",
        createdAt: terms.createdAt,
        updatedAt: terms.updatedAt,
      };

      return reply.code(200).send(response);
    } catch (error) {
      logger.error(`Get terms by language error: ${error.message}`);

      // Send proper error response
      return reply.code(500).send({
        error: "Internal Server Error",
        message: "Failed to retrieve terms",
      });
    }
  });

  // Get all terms (admin only)
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return termsController.getAllTerms(request, reply);
    }
  );

  // Create new terms (admin only)
  fastify.post(
    "/",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest({ body: termsSchema.create }),
      ],
    },
    async (request, reply) => {
      try {
        const { language, content, version } = request.body;

        // Validate required fields
        if (!language || !content) {
          return reply.code(400).send({
            error: "Bad Request",
            message: "Language and content are required",
          });
        }

        const terms = await termService.createOrUpdate(
          language,
          content,
          version
        );

        return reply.code(200).send(terms);
      } catch (error) {
        logger.error(`Create/update terms error: ${error.message}`);

        return reply.code(500).send({
          error: "Internal Server Error",
          message: "Failed to create or update terms",
        });
      }
    }
  );

  // Update terms (admin only)
  fastify.put(
    "/:id",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest({ body: termsSchema.update }),
      ],
    },
    async (request, reply) => {
      return termsController.updateTerms(request, reply);
    }
  );

  // Delete terms (admin only)
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return termsController.deleteTerms(request, reply);
    }
  );
}
