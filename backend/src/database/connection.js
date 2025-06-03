import { Sequelize } from "sequelize";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

// Create Sequelize instance with connection string or individual parameters
export const sequelize = config.database.connectionString
  ? new Sequelize(config.database.connectionString, {
      dialect: config.database.dialect,
      logging: config.database.logging ? (msg) => logger.debug(msg) : false,
      pool: config.database.pool,
      dialectOptions: config.database.dialectOptions,
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize(
      config.database.name,
      config.database.username,
      config.database.password,
      {
        host: config.database.host,
        port: config.database.port,
        dialect: config.database.dialect,
        logging: config.database.logging ? (msg) => logger.debug(msg) : false,
        pool: config.database.pool,
        dialectOptions: config.database.dialectOptions,
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");

    // Sync models in development
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      logger.info("Database models synchronized");
    }
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};
