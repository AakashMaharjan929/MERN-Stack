import mongoose from "mongoose";

// ---------------------------
// Location Sub-Schema
// ---------------------------
const locationSchema = new mongoose.Schema({
  street: { type: String, required: true }, // e.g., "123 Main Street"
  locality: { type: String }, // e.g., "Thamel" (optional neighborhood/area)
  city: { type: String, required: true },   // e.g., "Kathmandu"
  state: { type: String, required: true },  // e.g., "Bagmati Province"
  country: { type: String, required: true, default: "Nepal" }, // Updated default for Nepal context
  // No zipcode as per requirement
}, { _id: false }); // No _id for sub-document

// ---------------------------
// Main Theater Schema
// ---------------------------
const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: locationSchema, required: true },
    screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }], // Empty array initially
  },
  { timestamps: true }
);

// ---------------------------
// Class (Updated for Detailed Location with Locality)
// ---------------------------
class TheaterClass {
  constructor(name, location, screens = []) {
    this.name = name;
    this.location = location; // Expects object: { street, locality, city, state, country }
    this.screens = screens;   // Starts empty; add later via addScreen()
  }

  // Add a screen (unchanged)
  async addScreen(screenId) {
    if (!this.screens.includes(screenId)) {
      this.screens.push(screenId);
      await this.save();
    }
    return this.screens;
  }

  // Remove a screen (unchanged)
  async removeScreen(screenId) {
    this.screens = this.screens.filter((id) => id.toString() !== screenId.toString());
    await this.save();
    return this.screens;
  }

  // Get all screens (unchanged)
  getScreens() {
    return this.screens;
  }

  // Update theater details (updated to handle location object with locality)
  async updateDetails(name, location) {
    if (name) this.name = name;
    if (location) {
      // Merge or update location fields (includes locality)
      this.location = { ...this.location, ...location };
    }
    await this.save();
    return { name: this.name, location: this.location };
  }

  // Get total number of screens (unchanged)
  getTotalScreens() {
    return this.screens.length;
  }

  // Check if a screen exists in this theater (unchanged)
  hasScreen(screenId) {
    return this.screens.some((id) => id.toString() === screenId.toString());
  }

  // Updated: Get formatted full address (includes locality if present)
  getFullAddress() {
    const { street, locality, city, state, country } = this.location;
    const parts = [street];
    if (locality) parts.push(locality);
    parts.push(city, state, country);
    return parts.join(', ');
  }
}

// Attach class
theaterSchema.loadClass(TheaterClass);

// Export model
export default mongoose.model("Theater", theaterSchema);