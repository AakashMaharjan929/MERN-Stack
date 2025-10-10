import Theater from "../models/Theater.js";

// ---------------------------
// Add a new theater
// ---------------------------
export const addTheater = async (req, res) => {
  try {
    const { name, location } = req.body;

    // Validate location structure (optional but recommended for robustness)
    if (!location || typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country) {
      return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
    }

    const theater = new Theater({ name, location });
    await theater.save();

    res.status(201).json(theater);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Update theater details
// ---------------------------
export const updateTheater = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const theater = await Theater.findById(id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    // Validate location if provided (optional)
    if (location && (typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country)) {
      return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
    }

    const updated = await theater.updateDetails(name, location);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Delete theater
// ---------------------------
export const deleteTheater = async (req, res) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    await theater.deleteOne(); // Updated: Use deleteOne() instead of deprecated remove()
    res.json({ message: "Theater deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all theaters
// ---------------------------
export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().populate("screens");
    // Optional: Add fullAddress to each for frontend convenience
    const theatersWithAddress = theaters.map(theater => ({
      ...theater.toObject(),
      fullAddress: theater.getFullAddress ? theater.getFullAddress() : `${theater.location.street}${theater.location.locality ? ', ' + theater.location.locality : ''}, ${theater.location.city}, ${theater.location.state}, ${theater.location.country}`
    }));
    res.json(theatersWithAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get single theater by ID
// ---------------------------
export const getTheaterById = async (req, res) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id).populate("screens");
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    // Add fullAddress for frontend convenience
    const theaterWithAddress = {
      ...theater.toObject(),
      fullAddress: theater.getFullAddress ? theater.getFullAddress() : `${theater.location.street}${theater.location.locality ? ', ' + theater.location.locality : ''}, ${theater.location.city}, ${theater.location.state}, ${theater.location.country}`
    };
    res.json(theaterWithAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Add a screen to theater
// ---------------------------
export const addScreenToTheater = async (req, res) => {
  try {
    const { theaterId, screenId } = req.body;

    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    await theater.addScreen(screenId);
    res.json({ message: "Screen added", screens: theater.screens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Remove a screen from theater
// ---------------------------
export const removeScreenFromTheater = async (req, res) => {
  try {
    const { theaterId, screenId } = req.body;

    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    await theater.removeScreen(screenId);
    res.json({ message: "Screen removed", screens: theater.screens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};