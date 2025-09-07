import mongoose from "mongoose";

// ---------------------------
// Schema
// ---------------------------
const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }],
  },
  { timestamps: true }
);

// ---------------------------
// Class
// ---------------------------
class TheaterClass {
  constructor(name, location, screens = []) {
    this.name = name;
    this.location = location;
    this.screens = screens;
  }

  // Add a screen
  async addScreen(screenId) {
    if (!this.screens.includes(screenId)) {
      this.screens.push(screenId);
      await this.save();
    }
    return this.screens;
  }

  // Remove a screen
  async removeScreen(screenId) {
    this.screens = this.screens.filter((id) => id.toString() !== screenId.toString());
    await this.save();
    return this.screens;
  }

  // Get all screens
  getScreens() {
    return this.screens;
  }

  // Update theater details
  async updateDetails(name, location) {
    if (name) this.name = name;
    if (location) this.location = location;
    await this.save();
    return { name: this.name, location: this.location };
  }

  // Get total number of screens
  getTotalScreens() {
    return this.screens.length;
  }

  // Check if a screen exists in this theater
  hasScreen(screenId) {
    return this.screens.some((id) => id.toString() === screenId.toString());
  }
}

// Attach class
theaterSchema.loadClass(TheaterClass);

// Export model
export default mongoose.model("Theater", theaterSchema);
