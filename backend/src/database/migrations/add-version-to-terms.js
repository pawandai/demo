import { sequelize } from "../connection.js";
import { logger } from "../../utils/logger.js";

export const addVersionToTerms = async () => {
  try {
    // Check if version column exists
    const [results] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'terms' AND column_name = 'version'"
    );

    // If column doesn't exist, add it
    if (results.length === 0) {
      logger.info("Adding version column to terms table");
      await sequelize.query(
        "ALTER TABLE terms ADD COLUMN version VARCHAR(10) DEFAULT '1.0'"
      );
      logger.info("Version column added successfully");
    } else {
      logger.info("Version column already exists");
    }

    return true;
  } catch (error) {
    logger.error(`Error adding version column: ${error.message}`);
    throw error;
  }
};
