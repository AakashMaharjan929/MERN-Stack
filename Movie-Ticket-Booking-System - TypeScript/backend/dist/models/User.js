import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Booking from "./Booking.js";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    status: { type: String, enum: ["active", "blacklisted"], default: "active" }
}, { timestamps: true });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
class UserClass {
    static async createUser({ name, email, phone, password, role }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this({ name, email, phone, password: hashedPassword, role });
        return await user.save();
    }
    static async login(email, password) {
        const user = await this.findOne({ email });
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    async checkPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    async updateProfile({ name, email, phone }) {
        if (name)
            this.name = name;
        if (email)
            this.email = email;
        if (phone)
            this.phone = phone;
        return await this.save();
    }
    async changePassword(oldPass, newPass) {
        const match = await bcrypt.compare(oldPass, this.password);
        if (!match)
            return false;
        this.password = await bcrypt.hash(newPass, 10);
        await this.save();
        return true;
    }
    async deleteUser() {
        await this.deleteOne();
        return true;
    }
    isAdmin() {
        return this.role === "admin";
    }
    isBlacklisted() {
        return this.status === "blacklisted";
    }
    async getBookings() {
        return await Booking.find({ userId: this._id });
    }
    async cancelBooking(bookingId) {
        const booking = await Booking.findOne({ _id: bookingId, userId: this._id });
        if (!booking)
            return false;
        booking.status = "Cancelled";
        await booking.save();
        return true;
    }
}
userSchema.loadClass(UserClass);
const User = mongoose.model("User", userSchema);
export default User;
