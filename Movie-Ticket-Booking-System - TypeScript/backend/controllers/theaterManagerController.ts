import type { Request, Response } from "express";
import Theater from "../models/Theater.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Get manager's theater details
export const getMyTheater = async (req: Request, res: Response) => {
  try {
    const managerId = (req.user as any)._id;
    const theater = await Theater.findOne({ managerId }).populate('screens');
    
    if (!theater) {
      return res.status(404).json({ message: "Theater not found for this manager" });
    }

    res.json(theater);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update theater details (name, location)
export const updateMyTheater = async (req: Request, res: Response) => {
  try {
    const managerId = (req.user as any)._id;
    const { name, location } = req.body as any;

    if (location && (typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country)) {
      return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
    }

    const theater = await Theater.findOne({ managerId });
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const updated = await (theater as any).updateDetails(name, location);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all shows for manager's theater
export const getMyShows = async (req: Request, res: Response) => {
  try {
    const managerId = (req.user as any)._id;
    const theater = await Theater.findOne({ managerId });
    
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const shows = await Show.find({ screenId: { $in: theater.screens } })
      .populate('screenId')
      .populate('movieId')
      .sort({ showDate: -1 });

    res.json(shows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings for manager's theater
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const managerId = (req.user as any)._id;
    const theater = await Theater.findOne({ managerId }).populate('screens');
    
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const screenIds = theater.screens;
    const shows = await Show.find({ screenId: { $in: screenIds } });
    const showIds = shows.map(s => s._id);

    const bookings = await Booking.find({ showId: { $in: showIds } })
      .populate('userId')
      .populate({
        path: 'showId',
        populate: {
          path: 'movieId'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get revenue report for theater
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const managerId = (req.user as any)._id;
    const { startDate, endDate } = req.query;

    const theater = await Theater.findOne({ managerId }).populate('screens');
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const screenIds = theater.screens;
    const shows = await Show.find({ screenId: { $in: screenIds } });
    const showIds = shows.map(s => s._id);

    let query: any = { showId: { $in: showIds }, status: 'Confirmed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) {
        const endDateObj = new Date(endDate as string);
        endDateObj.setDate(endDateObj.getDate() + 1); // Include entire end date
        query.createdAt.$lte = endDateObj;
      }
    }

    const bookings = await Booking.find(query);

    const totalRevenue = bookings.reduce((sum, b: any) => sum + (b.totalPrice || 0), 0);
    const totalBookings = bookings.length;
    const totalSeatsBooked = bookings.reduce((sum, b: any) => sum + (b.seatNumbers?.length || 0), 0);

    res.json({
      theater: {
        id: theater._id,
        name: theater.name
      },
      period: {
        startDate,
        endDate
      },
      summary: {
        totalRevenue,
        totalBookings,
        totalSeatsBooked,
        averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
      }
    });
  } catch (err: any) {
    console.error('Revenue report error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const managerId = (req.user as any)._id;
    const theater = await Theater.findOne({ managerId }).populate('screens');
    
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const screenIds = theater.screens;
    const shows = await Show.find({ screenId: { $in: screenIds } });
    const showIds = shows.map(s => s._id);

    const totalBookings = await Booking.countDocuments({ showId: { $in: showIds } });
    const confirmedBookings = await Booking.countDocuments({ showId: { $in: showIds }, status: 'Confirmed' });
    const cancelledBookings = await Booking.countDocuments({ showId: { $in: showIds }, status: 'Cancelled' });

    const bookings = await Booking.find({ showId: { $in: showIds }, status: 'Confirmed' });
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);

    const now = new Date();
    const upcomingShows = await Show.countDocuments({
      screenId: { $in: screenIds },
      startTime: { $gte: now }
    });

    res.json({
      theater: {
        id: theater._id,
        name: theater.name,
        screenCount: screenIds.length
      },
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue,
        upcomingShows
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
// Create a new theater manager (Admin only)
export const createTheaterManager = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, theaterId } = req.body as any;

    // Validate theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create theater manager user
    const user = await User.createUser({
      name,
      email,
      phone,
      password,
      role: "theater_manager",
      theaterId
    });

    // Update theater with manager ID
    theater.managerId = (user as any)._id;
    await theater.save();

    res.status(201).json({
      message: "Theater manager created successfully",
      user: { id: (user as any)._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};