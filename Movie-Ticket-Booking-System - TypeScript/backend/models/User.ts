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
  _id!: mongoose.Schema.Types.ObjectId;
  name!: string;
  email!: string;
  phone!: string;
  password!: string;
  role!: string;
  status!: string;
  theaterId?: mongoose.Schema.Types.ObjectId;
  createdAt!: Date;

  static async createUser({ name, email, phone, password, role }: any) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new (this as any)({ name, email, phone, password: hashedPassword, role });
    return await user.save();
  }

  static async login(email: string, password: string) {
    const user = await (this as any).findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async checkPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  async updateProfile({ name, email, phone }: any) {
    if (name) this.name = name;
    if (email) this.email = email;
    if (phone) this.phone = phone;
    return await (this as unknown as mongoose.Document).save();
  }

  async changePassword(oldPass: string, newPass: string) {
    const match = await bcrypt.compare(oldPass, this.password);
    if (!match) return false;
    this.password = await bcrypt.hash(newPass, 10);
    await (this as unknown as mongoose.Document).save();
    return true;
  }

  async deleteUser() {
    await (this as unknown as mongoose.Document).deleteOne();
    return true;
  }

  isAdmin() {
    return this.role === "admin";
  }

  isTheaterManager() {
    return this.role === "theater_manager";
  }

  isBlacklisted() {
    return this.status === "blacklisted";
  }

  async getBookings() {
    return await Booking.find({ userId: (this as any)._id });
  }

  async cancelBooking(bookingId: mongoose.Schema.Types.ObjectId) {
    const booking = await Booking.findOne({ _id: bookingId, userId: (this as any)._id });
    if (!booking) return false;
    booking.status = "Cancelled";
    await booking.save();
    return true;
  }
}

userSchema.loadClass(UserClass);

export type IUserDocument = mongoose.HydratedDocument<UserClass>;
export type IUserModel = mongoose.Model<UserClass> & typeof UserClass;

const User = mongoose.model<UserClass, IUserModel>("User", userSchema);

export default User;
