import { Term } from "../models/Term.js";
import { logger } from "../utils/logger.js";

export class TermService {
  /**
   * Get terms by language
   * @param {string} language - The language code (en, sv)
   * @returns {Promise<Object>} Terms object
   */
  async getByLanguage(language) {
    try {
      const terms = await Term.findOne({
        where: { language: language.toLowerCase() },
      });

      // If terms exist but don't have version (handle DB schema mismatch)
      if (terms && !terms.version) {
        terms.dataValues.version = "1.0"; // Add default version
      }

      return terms;
    } catch (error) {
      logger.error(`Error in TermService.getByLanguage: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create or update terms for a language
   * @param {string} language - The language code (en, sv)
   * @param {string} content - HTML content of terms
   * @param {string} version - Optional version identifier
   * @returns {Promise<Object>} Created or updated terms
   */
  async createOrUpdate(language, content, version = "1.0") {
    try {
      // Find existing terms or create new one
      const [terms, created] = await Term.findOrCreate({
        where: { language: language.toLowerCase() },
        defaults: {
          content,
          version,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update if it already exists
      if (!created) {
        terms.content = content;
        terms.version = version;
        terms.updatedAt = new Date();
        await terms.save();
      }

      return terms;
    } catch (error) {
      logger.error(`Error in TermService.createOrUpdate: ${error.message}`);
      throw error;
    }
  }
}
