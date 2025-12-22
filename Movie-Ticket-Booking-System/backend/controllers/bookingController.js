// controllers/bookingController.js - Fixed spread operator bug on undefined query.bookingDate
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
// Get all bookings (with optional pagination and filters)
// ---------------------------
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, showId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (showId) query.showId = showId;

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .populate({
        path: "showId",
        select: "movieId theater screen startTime endTime availableSeats totalSeatCount",
        populate: { path: "movieId", select: "title genre" }
      })
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);
    res.json({ bookings, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get cancellations/refunds (for View Cancellations/Refunds submenu)
// ---------------------------
export const getCancellations = async (req, res) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo } = req.query;
    const query = { status: "Cancelled" };
    if (dateFrom) query.bookingDate = { ...(query.bookingDate || {}), $gte: new Date(dateFrom) };
    if (dateTo && !query.bookingDate) query.bookingDate = { $lte: new Date(dateTo) };
    else if (dateTo) query.bookingDate.$lte = new Date(dateTo);

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .populate("showId", "title theater screen startTime")
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Calculate refunds (e.g., 80% if >24h before show; customize as needed)
    const bookingsWithRefunds = bookings.map(b => {
      const showStart = b.showId?.startTime;
      const hoursBeforeShow = showStart ? (new Date(showStart) - new Date(b.bookingDate)) / (1000 * 60 * 60) : 0;
      const refundPercentage = hoursBeforeShow > 24 ? 0.8 : 0.5; // 80% if >24h, 50% otherwise
      return {
        ...b.toObject(),
        refundAmount: b.totalPrice * refundPercentage,
        refundStatus: "Processed" // Tie to a Payment model later
      };
    });

    const total = await Booking.countDocuments(query);
    res.json({ bookings: bookingsWithRefunds, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get ticket history (for Ticket History submenu)
// ---------------------------
export const getTicketHistory = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 50, dateFrom, dateTo } = req.query;
    const query = userId ? { userId } : {};
    if (status) query.status = status;
    if (dateFrom) query.bookingDate = { ...(query.bookingDate || {}), $gte: new Date(dateFrom) };
    if (dateTo && !query.bookingDate) query.bookingDate = { $lte: new Date(dateTo) };
    else if (dateTo) query.bookingDate.$lte = new Date(dateTo);

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .populate("showId", "title theater screen startTime seatLayout")
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);
    res.json({ bookings, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get revenue breakdown (for Revenue Breakdown submenu)
// ---------------------------
export const getRevenueBreakdown = async (req, res) => {
  try {
    const { dateFrom, dateTo, groupBy = "date" } = req.query; // groupBy: "date", "show", "theater", "movie"

    // Normalize date range to include the full days and default to recent window if not provided
    const now = new Date();
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const toDate = dateTo ? new Date(dateTo) : now;
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    const match = {
      status: { $ne: "Cancelled" },
      bookingDate: {
        $gte: startOfDay(fromDate),
        $lte: endOfDay(toDate)
      }
    };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "shows",
          localField: "showId",
          foreignField: "_id",
          as: "show"
        }
      },
      { $unwind: "$show" },
      {
        $lookup: {
          from: "movies",
          localField: "show.movieId",
          foreignField: "_id",
          as: "movie"
        }
      },
      { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id:
            groupBy === "date"
              ? { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } }
              : groupBy === "show"
              ? "$show.title"
              : groupBy === "movie"
              ? "$movie.title"
              : "$show.theater",
          totalRevenue: { $sum: "$totalPrice" },
          ticketCount: { $sum: { $size: "$seatIds" } },
          avgPrice: { $avg: "$totalPrice" },
          bookings: { $push: "$_id" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ];

    const revenue = await Booking.aggregate(pipeline);
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};