import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { userRepository } from "./auth.repository";
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  AuthResponseDto,
} from "./auth.dto";

/**
 * Auth Service
 * Handles authentication business logic
 * Implements Service Layer pattern
 */
export class AuthService {
  /**
   * Register a new user
   * @param data - Registration data (name, email, password)
   * @returns Auth response with user data and token
   * @throws Error if email already exists
   */
  async register(
    data: RegisterDto
  ): Promise<{ user: AuthResponseDto; token: string }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create new user
    const user = await userRepository.create(data.name, data.email, data.password);

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  /**
   * Login user
   * @param data - Login data (email, password)
   * @returns Auth response with user data and token
   * @throws Error if credentials are invalid
   */
  async login(
    data: LoginDto
  ): Promise<{ user: AuthResponseDto; token: string }> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await userRepository.verifyPassword(
      user,
      data.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  /**
   * Verify JWT token
   * @param token - JWT token to verify
   * @returns Decoded token with user ID
   * @throws Error if token is invalid or expired
   */
  verifyToken(token: string): { userId: string } {
    try {
      const decoded = (jwt as any).verify(token, env.JWT_SECRET) as {
        userId: string;
      };
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data
   * @throws Error if user not found
   */
  async getUserById(userId: string): Promise<AuthResponseDto> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.formatUserResponse(user);
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Update data
   * @returns Updated user data
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileDto
  ): Promise<AuthResponseDto> {
    const user = await userRepository.updateProfile(userId, data.name);
    if (!user) {
      throw new Error("User not found");
    }
    return this.formatUserResponse(user);
  }

  /**
   * Generate JWT token
   * @param userId - User ID
   * @returns JWT token
   * @private
   */
  private generateToken(userId: string): string {
    return (jwt as any).sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY,
    });
  }

  /**
   * Format user response
   * @param user - User document
   * @returns Formatted user response
   * @private
   */
  private formatUserResponse(user: any): AuthResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}

export const authService = new AuthService();
