import type { Request, Response } from "express";
import Theater from "../models/Theater.js";

export const addTheater = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body as any;

    if (!location || typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country) {
      return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
    }

    const theater = new Theater({ name, location });
    await theater.save();

    res.status(201).json(theater);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTheater = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body as any;

    const theater = await Theater.findById(id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    if (location && (typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country)) {
      return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
    }

    const updated = await (theater as any).updateDetails(name, location);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTheater = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    await theater.deleteOne();
    res.json({ message: "Theater deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTheaters = async (_req: Request, res: Response) => {
  try {
    const theaters = await Theater.find().populate("screens");
    const theatersWithAddress = theaters.map((theater) => ({
      ...theater.toObject(),
      fullAddress: (theater as any).getFullAddress ? (theater as any).getFullAddress() : `${(theater as any).location.street}${(theater as any).location.locality ? ', ' + (theater as any).location.locality : ''}, ${(theater as any).location.city}, ${(theater as any).location.state}, ${(theater as any).location.country}`
    }));
    res.json(theatersWithAddress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTheaterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id).populate("screens");
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    const theaterWithAddress = {
      ...theater.toObject(),
      fullAddress: (theater as any).getFullAddress ? (theater as any).getFullAddress() : `${(theater as any).location.street}${(theater as any).location.locality ? ', ' + (theater as any).location.locality : ''}, ${(theater as any).location.city}, ${(theater as any).location.state}, ${(theater as any).location.country}`
    };
    res.json(theaterWithAddress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addScreenToTheater = async (req: Request, res: Response) => {
  try {
    const { theaterId, screenId } = req.body as any;

    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    await (theater as any).addScreen(screenId);
    res.json({ message: "Screen added", screens: (theater as any).screens });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeScreenFromTheater = async (req: Request, res: Response) => {
  try {
    const { theaterId, screenId } = req.body as any;

    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    await (theater as any).removeScreen(screenId);
    res.json({ message: "Screen removed", screens: (theater as any).screens });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
