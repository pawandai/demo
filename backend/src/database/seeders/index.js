import { seedProducts } from "./productSeeder.js";
import { logger } from "../../utils/logger.js";

export const runSeeders = async () => {
  try {
    logger.info("Running database seeders...");

    // Add all seeders here
    await seedProducts();

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error(`Error running seeders: ${error.message}`);
    // Don't throw the error to allow server to start even if seeding fails
  }
};
