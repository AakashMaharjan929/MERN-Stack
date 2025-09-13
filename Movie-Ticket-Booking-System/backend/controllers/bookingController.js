import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// ---------------------------
// Create a booking (initial -> Pending)
// ---------------------------
export const createBooking = async (req, res) => {
  try {
    const { userId, showId, seatIds } = req.body;

    // Make sure show exists
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Check seat availability
    const unavailable = seatIds.filter((id) => !show.isSeatAvailable(id));
    if (unavailable.length > 0) {
      return res.status(400).json({ message: `Seats not available: ${unavailable.join(", ")}` });
    }

    // Create booking
    const booking = new Booking({ userId, showId, seatIds });

    // Calculate price
    await booking.calculateTotalPrice();
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Confirm booking
// ---------------------------
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.confirmBooking();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Cancel booking
// ---------------------------
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.cancelBooking();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Update seats in a booking
// ---------------------------
export const updateSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { newSeatIds } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.updateSeats(newSeatIds);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Apply discount
// ---------------------------
export const applyDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const newPrice = await booking.applyDiscount(code);
    res.json({ newPrice, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get booking by ID
// ---------------------------
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("userId")
      .populate("showId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all bookings
// ---------------------------
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId")
      .populate("showId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
