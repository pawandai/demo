import User from "../models/User.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/errors.js";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";

export class AuthController {
  async register(request, reply) {
    try {
      const { name, email, password, company, language = "sv" } = request.body;

      // Log the registration attempt
      logger.info(`Registration attempt for: ${email}, language: ${language}`);

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return reply.code(409).send({
          success: false,
          message:
            language === "sv"
              ? "Användare med denna e-post finns redan"
              : "User with this email already exists",
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        company,
        language,
        role: "user",
      });

      // Remove password from response
      const userResponse = { ...user.dataValues };
      delete userResponse.password;

      // Generate JWT token
      const token = request.jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: "7d" }
      );

      return reply.code(201).send({
        success: true,
        message:
          language === "sv"
            ? "Användare registrerad framgångsrikt"
            : "User registered successfully",
        user: userResponse,
        token,
      });
    } catch (error) {
      logger.error(`Register error: ${error.message}`);
      return reply.code(500).send({
        success: false,
        message:
          request.body.language === "sv"
            ? "Registrering misslyckades på grund av serverfel"
            : "Registration failed due to server error",
      });
    }
  }

  async login(request, reply) {
    try {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new ApiError(401, "Invalid email or password");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new ApiError(401, "Account is deactivated");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new ApiError(401, "Invalid email or password");
      }

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      // Generate JWT token
      const token = reply.jwtSign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Return user without password
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      };

      return reply.send({
        user: userResponse,
        token,
      });
    } catch (error) {
      logger.error("Login error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async getProfile(request, reply) {
    try {
      const user = await User.findByPk(request.user.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return reply.send(user);
    } catch (error) {
      logger.error("Get profile error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  async updateProfile(request, reply) {
    try {
      const updates = request.body;

      // Hash password if provided
      if (updates.password) {
        updates.password = await bcrypt.hash(
          updates.password,
          config.bcrypt.saltRounds
        );
      }

      const user = await User.findByPk(request.user.id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      await user.update(updates);

      // Return updated user without password
      const updatedUser = await User.findByPk(request.user.id, {
        attributes: { exclude: ["password"] },
      });

      return reply.send(updatedUser);
    } catch (error) {
      logger.error("Update profile error:", error);
      if (error instanceof ApiError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
