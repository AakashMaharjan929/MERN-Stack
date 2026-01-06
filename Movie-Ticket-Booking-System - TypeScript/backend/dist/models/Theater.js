import mongoose from "mongoose";
const locationSchema = new mongoose.Schema({
    street: { type: String, required: true },
    locality: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "Nepal" },
}, { _id: false });
const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: locationSchema, required: true },
    screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }],
}, { timestamps: true });
class TheaterClass {
    async addScreen(screenId) {
        if (!this.screens.some(id => id.toString() === screenId.toString())) {
            this.screens.push(screenId);
            await this.save();
        }
        return this.screens;
    }
    async removeScreen(screenId) {
        this.screens = this.screens.filter((id) => id.toString() !== screenId.toString());
        await this.save();
        return this.screens;
    }
    getScreens() {
        return this.screens;
    }
    async updateDetails(name, location) {
        if (name)
            this.name = name;
        if (location) {
            this.location = { ...this.location, ...location };
        }
        await this.save();
        return { name: this.name, location: this.location };
    }
    getTotalScreens() {
        return this.screens.length;
    }
    hasScreen(screenId) {
        return this.screens.some((id) => id.toString() === screenId.toString());
    }
    getFullAddress() {
        const { street, locality, city, state, country } = this.location;
        const parts = [street];
        if (locality)
            parts.push(locality);
        parts.push(city, state, country);
        return parts.join(', ');
    }
}
theaterSchema.loadClass(TheaterClass);
export default mongoose.model("Theater", theaterSchema);
