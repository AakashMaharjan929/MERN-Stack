import Screen from "../models/Screen.js";

// ---------------------------
// Add a new screen
// ---------------------------
export const addScreen = async (req, res) => {
  try {
    const { name, theaterId, seatLayout } = req.body;

    if (!seatLayout || !Array.isArray(seatLayout)) {
      return res.status(400).json({ error: "seatLayout must be a 2D array of seat objects" });
    }

    const totalSeats = seatLayout.flat().length;

    const screen = new Screen({
      name,
      theaterId,
      seatLayout,
      totalSeats
    });

    await screen.save();
    res.status(201).json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all screens
// ---------------------------
export const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find().populate("theaterId");
    res.json(screens);
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
    res.json(screen);
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

    if (name) screen.name = name;
    if (seatLayout && Array.isArray(seatLayout)) {
      await screen.updateSeatLayout(seatLayout);
    }

    await screen.save();
    res.json(screen);
  } catch (err) {
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

    await screen.deleteOne();
    res.json({ message: "Screen deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get seat layout (all seats)
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
// Get Standard or Premium seats
// ---------------------------
export const getSeatsByType = async (req, res) => {
  try {
    const { id, type } = req.params; // type = Standard | Premium
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    let seats = [];
    if (type === "Standard") seats = screen.getStandardSeats();
    else if (type === "Premium") seats = screen.getPremiumSeats();
    else return res.status(400).json({ error: "Invalid seat type" });

    res.json({ type, seats, count: seats.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
