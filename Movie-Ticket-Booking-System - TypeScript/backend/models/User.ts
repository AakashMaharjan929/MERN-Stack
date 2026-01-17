import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Booking from "./Booking.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin", "theater_manager"], default: "customer" },
  status: { type: String, enum: ["active", "blacklisted"], default: "active" },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", default: null }
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

class UserClass {
  // Properties
  _id!: mongoose.Schema.Types.ObjectId;
  name!: string;
  email!: string;
  phone!: string;
  password!: string;
  role!: "customer" | "admin" | "theater_manager";
  status!: "active" | "blacklisted";
  theaterId?: mongoose.Schema.Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validate user data
   */
  isValid(): boolean {
    return this.name && this.email && this.phone && this.password && 
           ["customer", "admin", "theater_manager"].includes(this.role) &&
           ["active", "blacklisted"].includes(this.status);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (basic)
   */
  private isValidPhone(phone: string): boolean {
    return phone.length >= 10 && /^\d+$/.test(phone);
  }

  /**
   * Validate password strength
   */
  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // ==================== AUTHENTICATION ====================
  /**
   * Check if password matches
   */
  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(`Password check failed: ${(error as Error).message}`);
    }
  }

  /**
   * Verify user for login
   */
  static async login(email: string, password: string): Promise<UserClass | null> {
    try {
      const user = await (this as any).findOne({ email });
      if (!user) return null;

      if (user.isBlacklisted()) {
        throw new Error("User is blacklisted");
      }

      const isMatch = await user.checkPassword(password);
      return isMatch ? user : null;
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`);
    }
  }

  /**
   * Change user password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      if (!this.isValidPassword(newPassword)) {
        throw new Error("New password must be at least 6 characters");
      }

      const isMatch = await bcrypt.compare(oldPassword, this.password);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      this.password = await bcrypt.hash(newPassword, 10);
      await (this as unknown as mongoose.Document).save();
      return true;
    } catch (error) {
      throw new Error(`Failed to change password: ${(error as Error).message}`);
    }
  }

  // ==================== PROFILE MANAGEMENT ====================
  /**
   * Update user profile
   */
  async updateProfile(data: { name?: string; email?: string; phone?: string }): Promise<UserClass> {
    try {
      if (data.name) {
        if (data.name.length < 2) throw new Error("Name must be at least 2 characters");
        this.name = data.name;
      }

      if (data.email) {
        if (!this.isValidEmail(data.email)) throw new Error("Invalid email format");
        this.email = data.email;
      }

      if (data.phone) {
        if (!this.isValidPhone(data.phone)) throw new Error("Invalid phone format");
        this.phone = data.phone;
      }

      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to update profile: ${(error as Error).message}`);
    }
  }

  /**
   * Get user profile data
   */
  getProfile(): Record<string, any> {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  // ==================== ROLE & PERMISSION METHODS ====================
  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.role === "admin";
  }

  /**
   * Check if user is theater manager
   */
  isTheaterManager(): boolean {
    return this.role === "theater_manager";
  }

  /**
   * Check if user is customer
   */
  isCustomer(): boolean {
    return this.role === "customer";
  }

  /**
   * Has specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions: Record<string, string[]> = {
      admin: ["manage_users", "manage_theaters", "manage_movies", "manage_shows", "view_analytics"],
      theater_manager: ["manage_screens", "manage_shows", "view_bookings"],
      customer: ["book_tickets", "view_bookings", "cancel_bookings"]
    };

    return permissions[this.role]?.includes(permission) || false;
  }

  /**
   * Get user role
   */
  getRole(): string {
    return this.role;
  }

  /**
   * Change user role (admin only)
   */
  async changeRole(newRole: "customer" | "admin" | "theater_manager"): Promise<any> {
    try {
      if (!["customer", "admin", "theater_manager"].includes(newRole)) {
        throw new Error("Invalid role");
      }
      this.role = newRole;
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to change role: ${(error as Error).message}`);
    }
  }

  // ==================== ACCOUNT STATUS ====================
  /**
   * Check if user is blacklisted
   */
  isBlacklisted(): boolean {
    return this.status === "blacklisted";
  }

  /**
   * Check if user is active
   */
  isActive(): boolean {
    return this.status === "active";
  }

  /**
   * Blacklist user
   */
  async blacklist(reason?: string): Promise<UserClass> {
    try {
      this.status = "blacklisted";
      await (this as unknown as mongoose.Document).save();
      // TODO: Log blacklist reason
      return this;
    } catch (error) {
      throw new Error(`Failed to blacklist user: ${(error as Error).message}`);
    }
  }

  /**
   * Unblacklist user
   */
  async unblacklist(): Promise<UserClass> {
    try {
      this.status = "active";
      await (this as unknown as mongoose.Document).save();
      return this;
    } catch (error) {
      throw new Error(`Failed to unblacklist user: ${(error as Error).message}`);
    }
  }

  /**
   * Deactivate user account
   */
  async deactivate(): Promise<UserClass> {
    try {
      this.status = "blacklisted";
      await (this as unknown as mongoose.Document).save();
      return this;
    } catch (error) {
      throw new Error(`Failed to deactivate account: ${(error as Error).message}`);
    }
  }

  // ==================== BOOKING MANAGEMENT ====================
  /**
   * Get user's bookings
   */
  async getBookings(limit = 10, skip = 0): Promise<any[]> {
    try {
      return await Booking.find({ userId: (this as any)._id })
        .sort({ bookingDate: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw new Error(`Failed to get bookings: ${(error as Error).message}`);
    }
  }

  /**
   * Get confirmed bookings
   */
  async getConfirmedBookings(): Promise<any[]> {
    try {
      return await Booking.find({ userId: (this as any)._id, status: "Confirmed" });
    } catch (error) {
      throw new Error(`Failed to get confirmed bookings: ${(error as Error).message}`);
    }
  }

  /**
   * Get pending bookings
   */
  async getPendingBookings(): Promise<any[]> {
    try {
      return await Booking.find({ userId: (this as any)._id, status: "Pending" });
    } catch (error) {
      throw new Error(`Failed to get pending bookings: ${(error as Error).message}`);
    }
  }

  /**
   * Get total bookings count
   */
  async getBookingCount(): Promise<number> {
    try {
      return await Booking.countDocuments({ userId: (this as any)._id });
    } catch (error) {
      throw new Error(`Failed to get booking count: ${(error as Error).message}`);
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: mongoose.Schema.Types.ObjectId): Promise<boolean> {
    try {
      const booking = await Booking.findOne({ _id: bookingId, userId: (this as any)._id });
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (!booking.canBeCancelled()) {
        throw new Error(`Cannot cancel booking with status: ${booking.status}`);
      }

      return await booking.cancelBooking() ? true : false;
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${(error as Error).message}`);
    }
  }

  // ==================== ACCOUNT MANAGEMENT ====================
  /**
   * Delete user account
   */
  async deleteUser(): Promise<boolean> {
    try {
      // Cancel all pending bookings
      const pendingBookings = await this.getPendingBookings();
      for (const booking of pendingBookings) {
        await booking.cancelBooking();
      }

      await (this as unknown as mongoose.Document).deleteOne();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${(error as Error).message}`);
    }
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create new user
   */
  static async createUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: "customer" | "admin" | "theater_manager";
  }): Promise<UserClass> {
    try {
      const user = new (this as any)(data);

      // Validate
      if (!user.name || user.name.length < 2) throw new Error("Invalid name");
      if (!user.isValidEmail(user.email)) throw new Error("Invalid email");
      if (!user.isValidPhone(user.phone)) throw new Error("Invalid phone");
      if (!user.isValidPassword(data.password)) throw new Error("Password must be at least 6 characters");

      // Check existing email
      const existing = await (this as any).findOne({ email: user.email });
      if (existing) throw new Error("Email already registered");

      // Hash password and save
      user.password = await bcrypt.hash(data.password, 10);
      user.role = data.role || "customer";
      user.status = "active";

      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
  }

  // ==================== QUERY METHODS ====================
  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<UserClass | null> {
    return await (this as any).findOne({ email });
  }

  /**
   * Get all admin users
   */
  static async getAdmins(): Promise<UserClass[]> {
    return await (this as any).find({ role: "admin" });
  }

  /**
   * Get all theater managers
   */
  static async getTheaterManagers(): Promise<UserClass[]> {
    return await (this as any).find({ role: "theater_manager" });
  }

  /**
   * Get all customers
   */
  static async getCustomers(): Promise<UserClass[]> {
    return await (this as any).find({ role: "customer" });
  }

  /**
   * Get active users
   */
  static async getActiveUsers(): Promise<UserClass[]> {
    return await (this as any).find({ status: "active" });
  }

  /**
   * Get blacklisted users
   */
  static async getBlacklistedUsers(): Promise<UserClass[]> {
    return await (this as any).find({ status: "blacklisted" });
  }
}

userSchema.loadClass(UserClass);

export type IUserDocument = mongoose.HydratedDocument<UserClass>;
export type IUserModel = mongoose.Model<UserClass> & typeof UserClass;

const User = mongoose.model<UserClass, IUserModel>("User", userSchema);

export default User;
