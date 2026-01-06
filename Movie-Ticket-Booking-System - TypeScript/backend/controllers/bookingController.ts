import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, showId, seatIds } = req.body as { userId: string; showId: string; seatIds: string[] };

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const unavailable = seatIds.filter((id) => !show.isSeatAvailable(id));
    if (unavailable.length > 0) {
      return res.status(400).json({ message: `Seats not available: ${unavailable.join(", ")}` });
    }

    const booking = new Booking({ userId, showId, seatIds });

    await booking.calculateTotalPrice();
    await booking.save();

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.confirmBooking();
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.cancelBooking();
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newSeatIds } = req.body as { newSeatIds: string[] };

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.updateSeats(newSeatIds);
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const applyDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code } = req.body as { code: string };

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const newPrice = await booking.applyDiscount(code);
    res.json({ newPrice, booking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("userId")
      .populate("showId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, userId, showId } = req.query as any;
    const query: Record<string, any> = {};
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
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Booking.countDocuments(query);
    res.json({ bookings, page: Number(page), limit: Number(limit), total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCancellations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo } = req.query as any;
    const query: any = { status: "Cancelled" };
    if (dateFrom) query.bookingDate = { ...(query.bookingDate || {}), $gte: new Date(dateFrom) };
    if (dateTo && !query.bookingDate) query.bookingDate = { $lte: new Date(dateTo) };
    else if (dateTo) query.bookingDate.$lte = new Date(dateTo);

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .populate("showId", "title theater screen startTime")
      .sort({ bookingDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const bookingsWithRefunds = bookings.map((b: any) => {
      const showStart = b.showId?.startTime;
      const hoursBeforeShow = showStart ? (new Date(showStart).getTime() - new Date(b.bookingDate).getTime()) / (1000 * 60 * 60) : 0;
      const refundPercentage = hoursBeforeShow > 24 ? 0.8 : 0.5;
      return {
        ...b.toObject(),
        refundAmount: b.totalPrice * refundPercentage,
        refundStatus: "Processed"
      };
    });

    const total = await Booking.countDocuments(query);
    res.json({ bookings: bookingsWithRefunds, page: Number(page), limit: Number(limit), total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTicketHistory = async (req: Request, res: Response) => {
  try {
    const { userId, status, page = 1, limit = 50, dateFrom, dateTo } = req.query as any;
    const query: any = userId ? { userId } : {};
    if (status) query.status = status;
    if (dateFrom) query.bookingDate = { ...(query.bookingDate || {}), $gte: new Date(dateFrom) };
    if (dateTo && !query.bookingDate) query.bookingDate = { $lte: new Date(dateTo) };
    else if (dateTo) query.bookingDate.$lte = new Date(dateTo);

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .populate({
        path: "showId",
        select: "startTime movieId",
        populate: {
          path: "movieId",
          select: "title"
        }
      })
      .sort({ bookingDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Booking.countDocuments(query);
    res.json({ bookings, page: Number(page), limit: Number(limit), total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRevenueBreakdown = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, groupBy = "date" } = req.query as any;

    const now = new Date();
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const toDate = dateTo ? new Date(dateTo) : now;
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

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

    const revenue = await Booking.aggregate(pipeline as any);
    res.json(revenue);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
