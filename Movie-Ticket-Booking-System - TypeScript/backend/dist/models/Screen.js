import mongoose from "mongoose";
const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Standard", "Premium", "VIP"], default: "Standard" },
    price: { type: Number, default: 0 },
}, { _id: false });
const screenSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    seatLayout: {
        type: [[mongoose.Schema.Types.Mixed]],
        required: true,
        validate: {
            validator: function (v) {
                const flatSeats = v.flat().filter(seat => seat !== null);
                return flatSeats.length > 0 && flatSeats.every((seat) => seat.seatNumber && seat.type);
            },
            message: 'Seat layout must contain at least one valid seat (aisles are allowed as null)'
        }
    },
    totalSeats: { type: Number, required: true, min: 1 },
}, { timestamps: true });
screenSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await mongoose.model('Theater').findByIdAndUpdate(this.theaterId, { $pull: { screens: this._id } });
        next();
    }
    catch (err) {
        next(err);
    }
});
class ScreenClass {
    calculateTotalSeats() {
        return this.seatLayout.flat().filter((seat) => seat !== null).length;
    }
    getSeatLayout() {
        return this.seatLayout;
    }
    async updateSeatLayout(newLayout) {
        this.seatLayout = newLayout;
        this.totalSeats = this.calculateTotalSeats();
        await this.save();
        return this;
    }
    getSeatsByType(type) {
        return this.seatLayout.flat().filter((seat) => seat !== null && seat.type === type);
    }
    getStandardSeats() {
        return this.getSeatsByType("Standard");
    }
    getPremiumSeats() {
        return this.getSeatsByType("Premium");
    }
    async resetSeatLayout(defaultLayout) {
        this.seatLayout = defaultLayout;
        this.totalSeats = this.calculateTotalSeats();
        await this.save();
        return this;
    }
    getCapacityBreakdown() {
        const breakdown = {};
        const validSeats = this.seatLayout.flat().filter((s) => s !== null);
        const types = [...new Set(validSeats.map((s) => s.type))];
        types.forEach(type => {
            breakdown[type] = this.getSeatsByType(type).length;
        });
        return breakdown;
    }
}
screenSchema.loadClass(ScreenClass);
export default mongoose.model("Screen", screenSchema);
