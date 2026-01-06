import type { Request, Response } from "express";
import Screen from "../models/Screen.js";
import Theater from "../models/Theater.js";

export const addScreen = async (req: Request, res: Response) => {
  try {
    const { name, theaterId, seatLayout } = req.body as any;

    if (!seatLayout || !Array.isArray(seatLayout)) {
      return res.status(400).json({ error: "seatLayout must be a 2D array (seats or null for aisles)" });
    }

    const flatSeats = seatLayout.flat().filter((s: any) => s !== null);
    if (flatSeats.length === 0) {
      return res.status(400).json({ error: "At least one valid seat required" });
    }

    const seatNumbers = flatSeats.map((s: any) => s.seatNumber);
    if (new Set(seatNumbers).size !== seatNumbers.length) {
      return res.status(400).json({ error: "Duplicate seat numbers in layout" });
    }

    const screen = new Screen({
      name: name.trim(),
      theaterId,
      seatLayout,
      totalSeats: flatSeats.length
    });

    await screen.save();

    const updatedTheater = await Theater.findByIdAndUpdate(theaterId, { $push: { screens: (screen as any)._id } });
    if (!updatedTheater) {
      return res.status(404).json({ error: "Theater not found" });
    }

    res.status(201).json(screen);
  } catch (err: any) {
    console.error('Add screen error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const getAllScreens = async (_req: Request, res: Response) => {
  try {
    const screens = await Screen.find().populate("theaterId");
    const screensWithAddress = screens.map(screen => ({
      ...screen.toObject(),
      fullAddress: (screen as any).theaterId?.getFullAddress ? (screen as any).theaterId.getFullAddress() : 'N/A'
    }));
    res.json(screensWithAddress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getScreenById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id).populate("theaterId");
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    const screenWithAddress = {
      ...screen.toObject(),
      fullAddress: (screen as any).theaterId?.getFullAddress ? (screen as any).theaterId.getFullAddress() : 'N/A'
    };
    res.json(screenWithAddress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateScreen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, seatLayout } = req.body as any;

    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    if (name) (screen as any).name = name.trim();

    if (seatLayout && Array.isArray(seatLayout)) {
      const flatSeats = seatLayout.flat().filter((s: any) => s !== null);
      if (flatSeats.length === 0) {
        return res.status(400).json({ error: "At least one valid seat required after update" });
      }
      (screen as any).seatLayout = seatLayout;
      (screen as any).totalSeats = flatSeats.length;
    }

    await screen.save();

    const updatedScreen = await Screen.findById(id).populate("theaterId");
    res.json(updatedScreen);
  } catch (err: any) {
    console.error('Update screen error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const deleteScreen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    await screen.deleteOne();
    res.json({ message: "Screen deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSeatLayout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    res.json({
      seatLayout: (screen as any).getSeatLayout(),
      totalSeats: (screen as any).totalSeats
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSeatsByType = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    const seats = (screen as any).getSeatsByType(type);
    res.json({ type, seats, count: seats.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCapacityBreakdown = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    const breakdown = (screen as any).getCapacityBreakdown();
    res.json({ breakdown, totalSeats: (screen as any).totalSeats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
