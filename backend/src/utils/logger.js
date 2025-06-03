import pino from "pino";
import { config } from "../config/index.js";

export const logger = pino({
  level: config.logging.level,
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
