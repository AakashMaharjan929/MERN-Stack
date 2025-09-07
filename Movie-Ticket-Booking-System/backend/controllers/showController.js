import Show from "../models/Show.js";
import Screen from "../models/Screen.js";

// ---------------------------
// Add a new show
// ---------------------------
export const addShow = async (req, res) => {
  try {
    const {
      movieId,
      screenId,
      startTime,
      endTime,
      standardBasePrice,
      premiumBasePrice,
      demandFactor,
      timeFactor,
    } = req.body;

    // Fetch screen to get seats (with seatType included in layout)
    const screen = await Screen.findById(screenId);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    // Convert screen seats -> availableSeats
    const seats = screen.seatLayout.flat().map((seat) => ({
      seatNumber: seat.seatNumber,
      seatType: seat.seatType || "Standard", // default if missing
      isBooked: false,
    }));

    const show = new Show({
      movieId,
      screenId,
      startTime,
      endTime,
      pricingRules: {
        standardBasePrice,
        premiumBasePrice,
        alpha: demandFactor,
        beta: timeFactor,
      },
      availableSeats: seats,
      totalSeatCount: seats.length,
    });

    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all shows
// ---------------------------
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movieId")
      .populate("screenId");
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get show by ID
// ---------------------------
export const getShowById = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id)
      .populate("movieId")
      .populate("screenId");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Book seats
// ---------------------------
export const bookSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body;

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const result = await show.bookSeats(seatIds);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------------------
// Cancel booked seats
// ---------------------------
export const cancelSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body;

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const result = await show.cancelBooking(seatIds);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------------------
// Get current dynamic price (for a given seat type)
// ---------------------------
export const getCurrentPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatType } = req.query; // ?seatType=Premium or Standard

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    if (!seatType) {
      return res.status(400).json({ message: "Seat type is required" });
    }

    const price = show.calculatePrice(seatType);
    res.json({ currentPrice: price, seatType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get available seats
// ---------------------------
export const getAvailableSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.json({ availableSeats: show.getAvailableSeats() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Delete a show
// ---------------------------
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    await show.deleteShow();
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Update a show
// ---------------------------
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const {
      movieId,
      screenId,
      startTime,
      endTime,
      standardBasePrice,
      premiumBasePrice,
      demandFactor,
      timeFactor,
    } = req.body;

    // Fetch screen to get updated seat layout (with seatType)
    const screen = await Screen.findById(screenId);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    // Merge existing booked seats with new layout
    const seatsFromScreen = screen.seatLayout.flat();
    const updatedSeats = seatsFromScreen.map((seat) => {
      const existingSeat = show.availableSeats.find(s => s.seatNumber === seat.seatNumber);
      return {
        seatNumber: seat.seatNumber,
        seatType: seat.seatType || "Standard",
        isBooked: existingSeat ? existingSeat.isBooked : false, // preserve booking
      };
    });

    await show.updateShow({
      movieId,
      screenId,
      startTime,
      endTime,
      pricingRules: {
        standardBasePrice,
        premiumBasePrice,
        alpha: demandFactor,
        beta: timeFactor,
      },
      availableSeats: updatedSeats,
      totalSeatCount: updatedSeats.length,
    });

    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

