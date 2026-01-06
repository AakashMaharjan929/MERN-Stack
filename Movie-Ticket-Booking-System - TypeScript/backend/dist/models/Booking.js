import mongoose from "mongoose";
import Show from "./Show.js";
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showId: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seatIds: [{ type: String, required: true }],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    },
    bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });
bookingSchema.index({ showId: 1, status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ userId: 1, status: 1 });
class BookingClass {
    async calculateTotalPrice() {
        const show = await Show.findById(this.showId);
        if (!show)
            throw new Error("Show not found");
        let total = 0;
        this.seatIds.forEach((seatId) => {
            const seat = show.availableSeats.find((s) => s && s.seatNumber === seatId);
            if (!seat)
                throw new Error(`Seat ${seatId} not found`);
            total += show.calculatePrice(seat.seatType);
        });
        this.totalPrice = total;
        return this.totalPrice;
    }
    async confirmBooking() {
        const show = await Show.findById(this.showId);
        if (!show)
            throw new Error("Show not found");
        await show.bookSeats(this.seatIds);
        this.status = "Confirmed";
        await this.save();
        await this.sendNotification("Booking Confirmed");
        return this;
    }
    async cancelBooking() {
        const show = await Show.findById(this.showId);
        if (!show)
            throw new Error("Show not found");
        await show.cancelBooking(this.seatIds);
        this.status = "Cancelled";
        await this.save();
        await this.sendNotification("Booking Cancelled");
        return this;
    }
    async checkSeatAvailability() {
        const show = await Show.findById(this.showId);
        if (!show)
            throw new Error("Show not found");
        const unavailable = this.seatIds.filter(id => !show.isSeatAvailable(id));
        return { allAvailable: unavailable.length === 0, unavailable };
    }
    async updateSeats(newSeatIds) {
        const show = await Show.findById(this.showId);
        if (!show)
            throw new Error("Show not found");
        await show.cancelBooking(this.seatIds);
        await show.bookSeats(newSeatIds);
        this.seatIds = newSeatIds;
        await this.calculateTotalPrice();
        await this.save();
        return this;
    }
    async sendNotification(message) {
        console.log(`Notification to user ${this.userId}: ${message}`);
    }
    async applyDiscount(code) {
        let discount = 0;
        if (code === "DISCOUNT10")
            discount = 0.1;
        else if (code === "DISCOUNT20")
            discount = 0.2;
        this.totalPrice = this.totalPrice - this.totalPrice * discount;
        this.totalPrice = Math.round(this.totalPrice);
        await this.save();
        return this.totalPrice;
    }
}
bookingSchema.loadClass(BookingClass);
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
