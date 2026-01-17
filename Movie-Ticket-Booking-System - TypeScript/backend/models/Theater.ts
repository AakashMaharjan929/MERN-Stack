import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  street: { type: String, required: true },
  locality: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: "Nepal" },
}, { _id: false });

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: locationSchema, required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }],
  },
  { timestamps: true }
);

class TheaterClass {
  // Properties
  name!: string;
  location!: Record<string, any>;
  managerId!: mongoose.Schema.Types.ObjectId;
  screens!: mongoose.Schema.Types.ObjectId[];
  createdAt!: Date;
  updatedAt!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validate theater data
   */
  isValid(): boolean {
    return this.name && this.location && this.managerId && 
           this.location.city && this.location.state && this.location.country;
  }

  /**
   * Validate location
   */
  private isValidLocation(location: any): boolean {
    return location.street && location.city && location.state && location.country;
  }

  // ==================== SCREEN MANAGEMENT ====================
  /**
   * Add screen to theater
   */
  async addScreen(screenId: mongoose.Schema.Types.ObjectId): Promise<mongoose.Schema.Types.ObjectId[]> {
    try {
      if (!this.screens.some(id => id.toString() === screenId.toString())) {
        this.screens.push(screenId);
        await (this as unknown as mongoose.Document).save();
      }
      return this.screens;
    } catch (error) {
      throw new Error(`Failed to add screen: ${(error as Error).message}`);
    }
  }

  /**
   * Remove screen from theater
   */
  async removeScreen(screenId: mongoose.Schema.Types.ObjectId): Promise<mongoose.Schema.Types.ObjectId[]> {
    try {
      this.screens = this.screens.filter((id) => id.toString() !== screenId.toString());
      await (this as unknown as mongoose.Document).save();
      return this.screens;
    } catch (error) {
      throw new Error(`Failed to remove screen: ${(error as Error).message}`);
    }
  }

  /**
   * Get all screens
   */
  getScreens(): mongoose.Schema.Types.ObjectId[] {
    return this.screens;
  }

  /**
   * Check if screen exists
   */
  hasScreen(screenId: mongoose.Schema.Types.ObjectId): boolean {
    return this.screens.some((id) => id.toString() === screenId.toString());
  }

  /**
   * Get total screens count
   */
  getTotalScreens(): number {
    return this.screens.length;
  }

  /**
   * Get screen count
   */
  getScreenCount(): number {
    return this.screens.length;
  }

  // ==================== LOCATION MANAGEMENT ====================
  /**
   * Update theater details
   */
  async updateDetails(name?: string, location?: Record<string, any>): Promise<Record<string, any>> {
    try {
      if (name && name.trim().length > 0) {
        this.name = name;
      }

      if (location) {
        if (!this.isValidLocation(location)) {
          throw new Error("Invalid location data");
        }
        this.location = { ...this.location, ...location };
      }

      await (this as unknown as mongoose.Document).save();
      return { name: this.name, location: this.location };
    } catch (error) {
      throw new Error(`Failed to update details: ${(error as Error).message}`);
    }
  }

  /**
   * Update location
   */
  async updateLocation(location: {
    street?: string;
    locality?: string;
    city: string;
    state: string;
    country?: string;
  }): Promise<Record<string, any>> {
    try {
      if (!this.isValidLocation(location)) {
        throw new Error("Invalid location data");
      }
      this.location = { ...this.location, ...location };
      await (this as unknown as mongoose.Document).save();
      return this.location;
    } catch (error) {
      throw new Error(`Failed to update location: ${(error as Error).message}`);
    }
  }

  /**
   * Get full address
   */
  getFullAddress(): string {
    const { street, locality, city, state, country } = this.location as any;
    const parts = [street];
    if (locality) parts.push(locality);
    parts.push(city, state, country || "Nepal");
    return parts.filter(p => p).join(", ");
  }

  /**
   * Get location
   */
  getLocation(): Record<string, any> {
    return this.location;
  }

  /**
   * Get city
   */
  getCity(): string {
    return this.location.city || "";
  }

  /**
   * Get state
   */
  getState(): string {
    return this.location.state || "";
  }

  // ==================== THEATER INFORMATION ====================
  /**
   * Get theater info
   */
  getTheaterInfo(): Record<string, any> {
    return {
      id: (this as any)._id,
      name: this.name,
      managerId: this.managerId,
      location: this.location,
      address: this.getFullAddress(),
      screens: this.screens,
      totalScreens: this.getTotalScreens(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Get basic info
   */
  getBasicInfo(): Record<string, any> {
    return {
      id: (this as any)._id,
      name: this.name,
      city: this.getCity(),
      state: this.getState(),
      totalScreens: this.getTotalScreens(),
    };
  }

  /**
   * Get summary
   */
  getSummary(): Record<string, any> {
    return {
      id: (this as any)._id,
      name: this.name,
      address: this.getFullAddress(),
      screens: this.getTotalScreens(),
    };
  }

  // ==================== MANAGER METHODS ====================
  /**
   * Get manager ID
   */
  getManagerId(): mongoose.Schema.Types.ObjectId {
    return this.managerId;
  }

  /**
   * Update manager
   */
  async updateManager(newManagerId: mongoose.Schema.Types.ObjectId): Promise<TheaterClass> {
    try {
      this.managerId = newManagerId;
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to update manager: ${(error as Error).message}`);
    }
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create new theater
   */
  static async createTheater(data: {
    name: string;
    managerId: string;
    location: {
      street: string;
      locality?: string;
      city: string;
      state: string;
      country?: string;
    };
  }): Promise<TheaterClass> {
    try {
      const theater = new (this as any)(data);
      if (!theater.isValid()) {
        throw new Error("Invalid theater data");
      }
      theater.screens = [];
      await theater.save();
      return theater;
    } catch (error) {
      throw new Error(`Failed to create theater: ${(error as Error).message}`);
    }
  }

  // ==================== QUERY METHODS ====================
  /**
   * Get theaters by manager
   */
  static async getTheatersByManager(managerId: string): Promise<TheaterClass[]> {
    return await (this as any).find({ managerId }).sort({ createdAt: -1 });
  }

  /**
   * Get theaters by city
   */
  static async getTheatersByCity(city: string): Promise<TheaterClass[]> {
    return await (this as any).find({ "location.city": city }).sort({ name: 1 });
  }

  /**
   * Get theaters by state
   */
  static async getTheatersByState(state: string): Promise<TheaterClass[]> {
    return await (this as any).find({ "location.state": state }).sort({ "location.city": 1 });
  }

  /**
   * Search theaters by name
   */
  static async searchTheaters(query: string): Promise<TheaterClass[]> {
    return await (this as any).find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { "location.city": { $regex: query, $options: "i" } }
      ]
    }).sort({ name: 1 });
  }

  /**
   * Get all theaters
   */
  static async getAllTheaters(): Promise<TheaterClass[]> {
    return await (this as any).find().sort({ name: 1 });
  }
}

theaterSchema.loadClass(TheaterClass);

export type ITheaterDocument = mongoose.HydratedDocument<TheaterClass>;
export default mongoose.model("Theater", theaterSchema);
