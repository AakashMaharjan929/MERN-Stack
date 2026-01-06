import type { Request, Response } from "express";
import Show from "../models/Show.js";
import Screen from "../models/Screen.js";
import mongoose from "mongoose";

export const suggestFactors = async (req: Request, res: Response) => {
  try {
    const { movieId, startTime } = req.query as any;
    if (!movieId || !startTime) {
      return res.status(400).json({ message: 'movieId and startTime required' });
    }

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ message: 'Invalid movieId format' });
    }

    const parsedStartTime = new Date(String(startTime));
    if (isNaN(parsedStartTime.getTime())) {
      return res.status(400).json({ message: 'Invalid startTime format' });
    }

    const suggestions = await Show.suggestFactors(movieId, startTime as string);
    res.json({
      suggestedAlpha: suggestions.alpha,
      suggestedBeta: suggestions.beta,
      rationale: suggestions.rationale
    });
  } catch (err: any) {
    console.error('Suggest factors error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const addShow = async (req: Request, res: Response) => {
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
      showType,
    } = req.body;

    if (!mongoose.isValidObjectId(movieId) || !mongoose.isValidObjectId(screenId)) {
      return res.status(400).json({ message: 'Invalid movieId or screenId format' });
    }

    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedEnd <= parsedStart) {
      return res.status(400).json({ message: 'Invalid startTime or endTime' });
    }

    const screen = await Screen.findById(screenId);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    const flatLayout = (screen as any).seatLayout.flat();
    const seats = flatLayout.map((seat: any) => {
      if (seat == null) {
        return null;
      }
      return {
        seatNumber: seat.seatNumber,
        seatType: seat.seatType || "Standard",
        isBooked: false,
      };
    });

    const show = new Show({
      movieId,
      screenId,
      startTime: parsedStart,
      endTime: parsedEnd,
      showType: showType || "Regular",
      pricingRules: {
        standardBasePrice,
        premiumBasePrice,
        alpha: demandFactor,
        beta: timeFactor,
      },
      availableSeats: seats,
      totalSeatCount: seats.filter((s: any) => s != null).length,
    });

    await show.save();

    const populatedShow = await Show.findById((show as any)._id).populate("movieId").populate("screenId");
    res.status(201).json(populatedShow);
  } catch (err: any) {
    console.error('Add show error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllShows = async (req: Request, res: Response) => {
  try {
    const { status, movieId } = req.query as any;

    const filter: Record<string, any> = {};
    if (movieId) filter.movieId = movieId;
    if (status && ['Upcoming', 'Live', 'Completed'].includes(status)) {
      filter.status = status;
    }

    let shows: any[] = await Show.find(filter)
      .populate("movieId")
      .populate({
        path: "screenId",
        populate: {
          path: "theaterId",
          model: "Theater",
        },
      })
      .sort({ startTime: 1 });

    shows = shows.map(show => {
      const plain = show.toObject();
      const standardPrice = show.calculatePrice('Standard');
      const premiumPrice = show.calculatePrice('Premium');

      plain.currentStandardPrice = standardPrice;
      plain.currentPremiumPrice = premiumPrice;
      return plain;
    });

    res.json(shows);
  } catch (err: any) {
    console.error('Get all shows error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getShowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id)
      .populate("movieId")
      .populate({
        path: "screenId",
        populate: {
          path: "theaterId",
          model: "Theater",
        },
      });

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const plainShow = show.toObject() as any;
    plainShow.currentStandardPrice = show.calculatePrice('Standard');
    plainShow.currentPremiumPrice = show.calculatePrice('Premium');

    res.json(plainShow);
  } catch (err: any) {
    console.error('Get show by ID error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const bookSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body as any;

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    if (show.status !== 'Upcoming') {
      return res.status(400).json({
        message: `Cannot book seats: Show is ${show.status.toLowerCase()}`
      });
    }

    const now = new Date();
    const bookingCutoff = new Date((show as any).startTime.getTime() - 15 * 60 * 1000);
    if (now > bookingCutoff) {
      return res.status(400).json({
        message: "Booking closed: Less than 15 minutes to show start"
      });
    }

    await show.bookSeats(seatIds);
    res.json({ success: true, bookedSeats: seatIds });
  } catch (err: any) {
    console.error('Book seats error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const cancelSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body as any;

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    if (show.status === 'Completed') {
      return res.status(400).json({
        message: "Cannot cancel: Show is already completed"
      });
    }
    if (show.status === 'Live') {
      return res.status(400).json({
        message: "Cannot cancel: Show is currently live"
      });
    }

    const result = await show.cancelBooking(seatIds);
    res.json(result);
  } catch (err: any) {
    console.error('Cancel seats error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getCurrentPrice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seatType } = req.query as any;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    if (!seatType || !["Standard", "Premium"].includes(seatType)) {
      return res.status(400).json({ message: "Valid seat type (Standard or Premium) is required" });
    }

    const price = show.calculatePrice(seatType as string);
    res.json({ currentPrice: price, seatType });
  } catch (err: any) {
    console.error('Get current price error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getAvailableSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.json({ availableSeats: show.getAvailableSeats() });
  } catch (err: any) {
    console.error('Get available seats error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    await show.deleteShow();
    res.json({ message: "Show deleted successfully" });
  } catch (err: any) {
    console.error('Delete show error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }
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
      showType,
    } = req.body;

    if (movieId && !mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ message: 'Invalid movieId format' });
    }
    if (screenId && !mongoose.isValidObjectId(screenId)) {
      return res.status(400).json({ message: 'Invalid screenId format' });
    }

    if (startTime || endTime) {
      const parsedStart = startTime ? new Date(startTime) : (show as any).startTime;
      const parsedEnd = endTime ? new Date(endTime) : (show as any).endTime;
      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedEnd <= parsedStart) {
        return res.status(400).json({ message: 'Invalid startTime or endTime' });
      }
    }

    let updatedSeats = (show as any).availableSeats;
    if (screenId && screenId !== (show as any).screenId.toString()) {
      const screen = await Screen.findById(screenId);
      if (!screen) return res.status(404).json({ message: "Screen not found" });

      const seatsFromScreen = (screen as any).seatLayout.flat();
      updatedSeats = seatsFromScreen.map((seat: any) => {
        if (seat == null) {
          return null;
        }
        const existingSeat = (show as any).availableSeats.find((s: any) => s && s.seatNumber === seat.seatNumber);
        return {
          seatNumber: seat.seatNumber,
          seatType: seat.seatType || "Standard",
          isBooked: existingSeat ? existingSeat.isBooked : false,
        };
      });
    }

    await show.updateShow({
      movieId,
      screenId,
      startTime,
      endTime,
      showType: showType || (show as any).showType,
      pricingRules: {
        ...(show as any).pricingRules || {},
        standardBasePrice,
        premiumBasePrice,
        alpha: demandFactor,
        beta: timeFactor,
      },
      availableSeats: updatedSeats,
      totalSeatCount: updatedSeats.filter((s: any) => s != null).length,
    });

    const populatedShow = await Show.findById((show as any)._id).populate("movieId").populate("screenId");
    res.json(populatedShow);
  } catch (err: any) {
    console.error('Update show error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const bulkCreateShows = async (req: Request, res: Response) => {
  try {
    const showDataArray = req.body as any[];

    if (!Array.isArray(showDataArray) || showDataArray.length === 0) {
      return res.status(400).json({ message: "Request body must be a non-empty array of show data" });
    }

    for (const data of showDataArray) {
      if (!mongoose.isValidObjectId(data.movieId) || !mongoose.isValidObjectId(data.screenId)) {
        return res.status(400).json({ message: 'Invalid movieId or screenId in bulk data' });
      }
      const parsedStart = new Date(data.startTime);
      const parsedEnd = new Date(data.endTime);
      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedEnd <= parsedStart) {
        return res.status(400).json({ message: 'Invalid dates in bulk data' });
      }
    }

    const createdShows = await Show.bulkCreate(showDataArray);
    const populatedShows = await Show.find({ _id: { $in: createdShows.map((s: any) => s._id) } })
      .populate("movieId")
      .populate("screenId");
    res.status(201).json(populatedShows);
  } catch (err: any) {
    console.error('Bulk create shows error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const checkConflicts = async (req: Request, res: Response) => {
  try {
    const { screenId, startTime, endTime } = req.query as any;

    if (!screenId || !startTime || !endTime) {
      return res.status(400).json({ message: "screenId, startTime, and endTime are required" });
    }

    if (!mongoose.isValidObjectId(screenId)) {
      return res.status(400).json({ message: 'Invalid screenId format' });
    }

    const proposedStart = new Date(startTime);
    const proposedEnd = new Date(endTime);

    if (isNaN(proposedStart.getTime()) || isNaN(proposedEnd.getTime()) || proposedEnd <= proposedStart) {
      return res.status(400).json({ message: "Invalid startTime or endTime" });
    }

    const conflicts = await Show.checkConflicts(screenId as any, proposedStart, proposedEnd);
    res.json({ conflicts });
  } catch (err: any) {
    console.error('Check conflicts error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const optimizeShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }
    if (!show) return res.status(404).json({ message: "Show not found" });
    const result = await show.calculateOptimalFactors();
    res.json({ message: 'Optimized successfully', ...result });
  } catch (err: any) {
    console.error('Optimize show error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getSeatCounts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const totalBookable = show.availableSeats.filter((s: any) => s != null).length;
    const available = show.getAvailableSeats().length;
    const booked = show.availableSeats.filter((s: any) => s && s.isBooked).length;

    res.json({ totalBookable, available, booked, fillRate: (booked / totalBookable * 100).toFixed(1) + '%' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshShowStatuses = async (_req: Request, res: Response) => {
  try {
    await Show.updateAllShowStatuses();
    res.json({ message: "All show statuses updated successfully" });
  } catch (err: any) {
    console.error('Refresh statuses error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const lockSeats = async (showId: string, seatNumbers: string[]) => {
  await Show.updateOne(
    { _id: showId },
    {
      $set: {
        'availableSeats.$[seat].isBooked': true
      }
    },
    {
      arrayFilters: [
        { 'seat.seatNumber': { $in: seatNumbers } }
      ]
    }
  );
};
