import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: Number.parseInt(process.env.PORT) || 8000,
    host: process.env.HOST || "0.0.0.0",
  },
  database: {
    // Use connection string if provided, otherwise fall back to individual parameters
    connectionString:
      process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING,
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || "123fakturera",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret",
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || "30d",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  bcrypt: {
    saltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
