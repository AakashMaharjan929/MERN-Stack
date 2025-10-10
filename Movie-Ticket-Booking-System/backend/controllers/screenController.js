// Updated screenController.js - Adjusted to handle nulls in seatLayout
import Screen from "../models/Screen.js";
import Theater from "../models/Theater.js"; // Import for linking

// ---------------------------
// Add a new screen
// ---------------------------
export const addScreen = async (req, res) => {
  try {
    const { name, theaterId, seatLayout } = req.body;

    console.log('Received data:', { name, theaterId, seatLayoutLength: seatLayout?.length }); // Debug log

    if (!seatLayout || !Array.isArray(seatLayout)) {
      return res.status(400).json({ error: "seatLayout must be a 2D array (seats or null for aisles)" });
    }

    // Filter non-null seats for validation
    const flatSeats = seatLayout.flat().filter(s => s !== null);
    if (flatSeats.length === 0) {
      return res.status(400).json({ error: "At least one valid seat required" });
    }

    // Optional: Validate unique seatNumbers (only for actual seats)
    const seatNumbers = flatSeats.map(s => s.seatNumber);
    if (new Set(seatNumbers).size !== seatNumbers.length) {
      return res.status(400).json({ error: "Duplicate seat numbers in layout" });
    }

    const screen = new Screen({
      name: name.trim(),
      theaterId,
      seatLayout, // Can include nulls
      totalSeats: flatSeats.length // Count only valid seats
    });

    await screen.save();

    // Auto-link to theater (cascade forward)
    const updatedTheater = await Theater.findByIdAndUpdate(theaterId, { $push: { screens: screen._id } });
    if (!updatedTheater) {
      console.log('Theater not found for ID:', theaterId); // Debug
      return res.status(404).json({ error: "Theater not found" });
    }

    console.log('Screen added and linked:', screen._id); // Debug

    res.status(201).json(screen);
  } catch (err) {
    console.error('Add screen error:', err.message, err.stack); // Full error log
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all screens
// ---------------------------
export const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find().populate("theaterId");
    // Add fullAddress from populated theater for convenience
    const screensWithAddress = screens.map(screen => ({
      ...screen.toObject(),
      fullAddress: screen.theaterId?.getFullAddress ? screen.theaterId.getFullAddress() : 'N/A'
    }));
    res.json(screensWithAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get screen by ID
// ---------------------------
export const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id).populate("theaterId");
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    // Add fullAddress from populated theater
    const screenWithAddress = {
      ...screen.toObject(),
      fullAddress: screen.theaterId?.getFullAddress ? screen.theaterId.getFullAddress() : 'N/A'
    };
    res.json(screenWithAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Update screen
// ---------------------------
export const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, seatLayout } = req.body;

    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    if (name) screen.name = name.trim();

    if (seatLayout && Array.isArray(seatLayout)) {
      // Filter non-null for recalc and validation
      const flatSeats = seatLayout.flat().filter(s => s !== null);
      if (flatSeats.length === 0) {
        return res.status(400).json({ error: "At least one valid seat required after update" });
      }
      // Optional: Check duplicates on update (compare with existing if needed, but skip for simplicity)
      screen.seatLayout = seatLayout; // Allow nulls
      screen.totalSeats = flatSeats.length; // Recalc only valid seats
    }

    await screen.save();

    // Repopulate for response
    const updatedScreen = await Screen.findById(id).populate("theaterId");
    res.json(updatedScreen);
  } catch (err) {
    console.error('Update screen error:', err.message, err.stack); // Enhanced logging
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Delete screen
// ---------------------------
export const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    await screen.deleteOne(); // Middleware handles cascade to Theater
    res.json({ message: "Screen deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get seat layout (all seats, includes nulls for aisles)
// ---------------------------
export const getSeatLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    res.json({
      seatLayout: screen.getSeatLayout(),
      totalSeats: screen.totalSeats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get seats by type (Standard, Premium, VIP - excludes nulls)
// ---------------------------
export const getSeatsByType = async (req, res) => {
  try {
    const { id, type } = req.params; // type = Standard | Premium | VIP
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    const seats = screen.getSeatsByType(type);
    res.json({ type, seats, count: seats.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get capacity breakdown (for reports/management - excludes nulls)
// ---------------------------
export const getCapacityBreakdown = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    const breakdown = screen.getCapacityBreakdown();
    res.json({ breakdown, totalSeats: screen.totalSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};