import { User, IUser } from "../user/user.model";
import bcrypt from "bcrypt";

/**
 * User Repository
 * Handles all database operations for users
 * Implements the Data Access Layer (DAL) pattern
 */
export class UserRepository {
  /**
   * Find a user by ID
   * @param id - User ID (ObjectId)
   * @returns User document or null
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  /**
   * Find a user by email
   * @param email - User email
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Create a new user with hashed password
   * @param name - User name
   * @param email - User email
   * @param password - Plain password (will be hashed)
   * @returns Created user document
   */
  async create(name: string, email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    return await user.save();
  }

  /**
   * Verify user password
   * @param user - User document
   * @param password - Plain password to verify
   * @returns Boolean indicating if password matches
   */
  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    // Need to select password field as it's not selected by default
    const userWithPassword = await User.findById(user._id).select("+password").exec();
    if (!userWithPassword) return false;
    return await bcrypt.compare(password, userWithPassword.password);
  }

  /**
   * Update user profile
   * @param id - User ID
   * @param name - New name (optional)
   * @returns Updated user document
   */
  async updateProfile(id: string, name?: string): Promise<IUser | null> {
    const updateData: any = {};
    if (name) updateData.name = name;
    
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }
}

export const userRepository = new UserRepository();
