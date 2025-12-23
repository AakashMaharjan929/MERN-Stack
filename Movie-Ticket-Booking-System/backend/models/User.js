// Updated userModel.js - Added status field and admin methods
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Booking from "./Booking.js";

// Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  status: { type: String, enum: ["active", "blacklisted"], default: "active" } // NEW: For blacklisting
}, { timestamps: true });

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Class
class UserClass {
  constructor(name, email, phone, password, role = "customer") {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
  }

  // Factory method
  static async createUser({ name, email, phone, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this({ name, email, phone, password: hashedPassword, role });
    return await user.save();
  }

  // Login (simplified, controller usually calls this)
  static async login(email, password) {
    const user = await this.findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  // Check password
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Update profile
  async updateProfile({ name, email, phone }) {
    if (name) this.name = name;
    if (email) this.email = email;
    if (phone) this.phone = phone;
    return await this.save();
  }

  // Change password
  async changePassword(oldPass, newPass) {
    const match = await bcrypt.compare(oldPass, this.password);
    if (!match) return false;
    this.password = await bcrypt.hash(newPass, 10);
    await this.save();
    return true;
  }

  // Delete user
  async deleteUser() {
    await this.deleteOne();
    return true;
  }

  // Role check
  isAdmin() {
    return this.role === "admin";
  }

  // NEW: Check if blacklisted
  isBlacklisted() {
    return this.status === "blacklisted";
  }

  // Get user bookings
  async getBookings() {
    return await Booking.find({ userId: this._id });
  }

  // Cancel a booking
  async cancelBooking(bookingId) {
    const booking = await Booking.findOne({ _id: bookingId, userId: this._id });
    if (!booking) return false;
    booking.status = "cancelled";
    await booking.save();
    return true;
  }
}

// Attach class
userSchema.loadClass(UserClass);

// Export Model
export default mongoose.model("User", userSchema);