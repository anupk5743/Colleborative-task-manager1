import { AuthService } from "../modules/auth/auth.service";
import { userRepository } from "../modules/auth/auth.repository";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../modules/auth/auth.repository");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let mockUser: any;

  beforeEach(() => {
    authService = new AuthService();
    mockUser = {
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
    };
    jest.clearAllMocks();
  });

  describe("register", () => {
    /**
     * Test 1: Successful user registration
     * Should create a new user and return auth response with token
     */
    it("should successfully register a new user", async () => {
      const registerData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const result = await authService.register(registerData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerData.email
      );
      expect(userRepository.create).toHaveBeenCalledWith(
        registerData.name,
        registerData.email,
        registerData.password
      );
      expect(result.user).toEqual({
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(result.token).toBe("jwt-token");
    });

    /**
     * Test 2: Registration with existing email
     * Should throw error when email already exists
     */
    it("should throw error if email already exists", async () => {
      const registerData = {
        name: "John Doe",
        email: "existing@example.com",
        password: "password123",
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.register(registerData)).rejects.toThrow(
        "Email already registered"
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    /**
     * Test 3: Login with valid credentials
     * Should return user and token when credentials are correct
     */
    it("should successfully login user with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.verifyPassword as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const result = await authService.login(loginData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(userRepository.verifyPassword).toHaveBeenCalledWith(
        mockUser,
        loginData.password
      );
      expect(result.user).toEqual({
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(result.token).toBe("jwt-token");
    });
  });

  describe("login", () => {
    /**
     * Test 4: Login with invalid email
     * Should throw error when user not found
     */
    it("should throw error if user not found", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    /**
     * Test 5: Login with invalid password
     * Should throw error when password doesn't match
     */
    it("should throw error if password is incorrect", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });
  });

  describe("verifyToken", () => {
    /**
     * Test 6: Token verification with valid token
     * Should return decoded token with userId
     */
    it("should verify valid token", () => {
      const token = "valid-jwt-token";
      const decodedToken = { userId: "user123" };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = authService.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(result).toEqual(decodedToken);
    });

    /**
     * Test 7: Invalid or expired token
     * Should throw error for invalid token
     */
    it("should throw error for invalid token", () => {
      const token = "invalid-token";

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid token");
      });

      expect(() => authService.verifyToken(token)).toThrow(
        "Invalid or expired token"
      );
    });
  });

  describe("getUserById", () => {
    /**
     * Test 8: Get user profile
     * Should return user data when user exists
     */
    it("should retrieve user by ID", async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getUserById("user123");

      expect(userRepository.findById).toHaveBeenCalledWith("user123");
      expect(result).toEqual({
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    /**
     * Test 9: Get non-existent user
     * Should throw error when user not found
     */
    it("should throw error if user not found", async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(authService.getUserById("nonexistent")).rejects.toThrow(
        "User not found"
      );
    });
  });
});
