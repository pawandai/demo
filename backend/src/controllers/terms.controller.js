import Terms from "../models/Terms.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/errors.js";
import { Op } from "sequelize";

export class TermsController {
  async getTermsByLanguage(request, reply) {
    try {
      const { language } = request.params;

      // Validate language parameter
      if (!["sv", "en"].includes(language)) {
        throw new ApiError(
          400,
          "Invalid language. Supported languages: sv, en"
        );
      }

      // Get the most recent active terms for the specified language
      const terms = await Terms.findOne({
        where: {
          language,
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      });

      if (!terms) {
        // Return default terms based on language
        const defaultTerms = {
          sv: {
            language: "sv",
            content: `
              <h2>Allmänna villkor</h2>
              <p><strong>GENOM ATT</strong> klicka på Fakturera Nu så väljer ni att registrera enligt den information som ni har lagt in och texten på registrerings sidan och villkoren här, och accepterar samtidigt villkoren här.</p>
              <p>Ni kan använda programmet GRATIS i 14 dagar.</p>
              <p>123 Fakturera är så lätt och självförklarande att chansen för att du kommer behöva support är minimal, men om du skulle behöva support, så är vi här för dig, med vårt kontor bemannat större delen av dygnet. Efter provperioden kostar programmet 99 kr per månad.</p>

              <h3>Användningsvillkor</h3>
              <p>Genom att använda våra tjänster accepterar du följande villkor:</p>
              <ul>
                <li>Du får endast använda tjänsten för lagliga ändamål</li>
                <li>Du ansvarar för att hålla dina inloggningsuppgifter säkra</li>
                <li>Vi förbehåller oss rätten att avsluta konton som bryter mot våra villkor</li>
                <li>All data som lagras i systemet är din egendom</li>
              </ul>

              <h3>Betalningsvillkor</h3>
              <p>Efter den kostnadsfria provperioden på 14 dagar debiteras 99 kr per månad. Betalning sker automatiskt via registrerat betalkort.</p>

              <h3>Uppsägning</h3>
              <p>Du kan när som helst säga upp din prenumeration genom att kontakta vår kundtjänst eller via ditt konto.</p>

              <h3>Integritet</h3>
              <p>Vi värnar om din integritet och behandlar dina personuppgifter enligt gällande dataskyddsförordning (GDPR).</p>

              <h3>Kontakt</h3>
              <p>Vid frågor om dessa villkor, kontakta oss på support@123fakturera.se</p>
            `,
            version: "1.0.0",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          en: {
            language: "en",
            content: `
              <h2>Terms and Conditions</h2>
              <p><strong>BY</strong> clicking on "Invoice Now" you choose to register according to the information you have entered and the text on the registration page and the terms here, and at the same time accept the terms here.</p>
              <p>You can use the program FREE for 14 days.</p>
              <p>123 Fakturera is so easy and self-explanatory that the chance that you will need support is minimal, but if you need support, we are here for you, with our office staffed most of the day. After the trial period, the program costs 99 SEK per month.</p>

              <h3>Terms of Use</h3>
              <p>By using our services, you accept the following terms:</p>
              <ul>
                <li>You may only use the service for legal purposes</li>
                <li>You are responsible for keeping your login credentials secure</li>
                <li>We reserve the right to terminate accounts that violate our terms</li>
                <li>All data stored in the system is your property</li>
              </ul>

              <h3>Payment Terms</h3>
              <p>After the free trial period of 14 days, 99 SEK per month is charged. Payment is made automatically via registered payment card.</p>

              <h3>Cancellation</h3>
              <p>You can cancel your subscription at any time by contacting our customer service or via your account.</p>

              <h3>Privacy</h3>
              <p>We care about your privacy and process your personal data in accordance with the applicable General Data Protection Regulation (GDPR).</p>

              <h3>Contact</h3>
              <p>If you have questions about these terms, contact us at support@123fakturera.se</p>
            `,
            version: "1.0.0",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };

        return reply.send(defaultTerms[language]);
      }

      return reply.send(terms);
    } catch (error) {
      logger.error("Get terms by language error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getAllTerms(request, reply) {
    try {
      // Only admins can view all terms
      if (request.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
      }

      const {
        language,
        isActive,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 20,
      } = request.query;

      const whereClause = {};

      if (language) {
        whereClause.language = language;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === "true";
      }

      const offset = (page - 1) * limit;

      const { count, rows: terms } = await Terms.findAndCountAll({
        where: whereClause,
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

      return reply.send({ data: terms, pagination });
    } catch (error) {
      logger.error("Get all terms error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async createTerms(request, reply) {
    try {
      // Only admins can create terms
      if (request.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
      }

      const { language, content, version, isActive } = request.body;

      // If setting this terms as active, deactivate other terms for the same language
      if (isActive) {
        await Terms.update({ isActive: false }, { where: { language } });
      }

      const terms = await Terms.create({
        language,
        content,
        version,
        isActive,
      });

      return reply.code(201).send(terms);
    } catch (error) {
      logger.error("Create terms error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async updateTerms(request, reply) {
    try {
      // Only admins can update terms
      if (request.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
      }

      const { id } = request.params;
      const { language, content, version, isActive } = request.body;

      // Find terms
      const terms = await Terms.findByPk(id);
      if (!terms) {
        throw new ApiError(404, "Terms not found");
      }

      // If setting this terms as active, deactivate other terms for the same language
      if (isActive && !terms.isActive && language) {
        await Terms.update(
          { isActive: false },
          { where: { language, id: { [Op.ne]: id } } }
        );
      }

      // Update terms
      await terms.update({
        language: language || terms.language,
        content: content || terms.content,
        version: version || terms.version,
        isActive: isActive !== undefined ? isActive : terms.isActive,
      });

      return reply.send(terms);
    } catch (error) {
      logger.error("Update terms error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async deleteTerms(request, reply) {
    try {
      // Only admins can delete terms
      if (request.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
      }

      const { id } = request.params;

      // Find terms
      const terms = await Terms.findByPk(id);
      if (!terms) {
        throw new ApiError(404, "Terms not found");
      }

      // Delete terms
      await terms.destroy();

      return reply.send({
        success: true,
        message: "Terms deleted successfully",
      });
    } catch (error) {
      logger.error("Delete terms error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
