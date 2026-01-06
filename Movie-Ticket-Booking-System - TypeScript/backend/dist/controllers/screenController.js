import Screen from "../models/Screen.js";
import Theater from "../models/Theater.js";
export const addScreen = async (req, res) => {
    try {
        const { name, theaterId, seatLayout } = req.body;
        if (!seatLayout || !Array.isArray(seatLayout)) {
            return res.status(400).json({ error: "seatLayout must be a 2D array (seats or null for aisles)" });
        }
        const flatSeats = seatLayout.flat().filter((s) => s !== null);
        if (flatSeats.length === 0) {
            return res.status(400).json({ error: "At least one valid seat required" });
        }
        const seatNumbers = flatSeats.map((s) => s.seatNumber);
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
        const updatedTheater = await Theater.findByIdAndUpdate(theaterId, { $push: { screens: screen._id } });
        if (!updatedTheater) {
            return res.status(404).json({ error: "Theater not found" });
        }
        res.status(201).json(screen);
    }
    catch (err) {
        console.error('Add screen error:', err.message, err.stack);
        res.status(500).json({ error: err.message });
    }
};
export const getAllScreens = async (_req, res) => {
    try {
        const screens = await Screen.find().populate("theaterId");
        const screensWithAddress = screens.map(screen => ({
            ...screen.toObject(),
            fullAddress: screen.theaterId?.getFullAddress ? screen.theaterId.getFullAddress() : 'N/A'
        }));
        res.json(screensWithAddress);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getScreenById = async (req, res) => {
    try {
        const { id } = req.params;
        const screen = await Screen.findById(id).populate("theaterId");
        if (!screen)
            return res.status(404).json({ message: "Screen not found" });
        const screenWithAddress = {
            ...screen.toObject(),
            fullAddress: screen.theaterId?.getFullAddress ? screen.theaterId.getFullAddress() : 'N/A'
        };
        res.json(screenWithAddress);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateScreen = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, seatLayout } = req.body;
        const screen = await Screen.findById(id);
        if (!screen)
            return res.status(404).json({ message: "Screen not found" });
        if (name)
            screen.name = name.trim();
        if (seatLayout && Array.isArray(seatLayout)) {
            const flatSeats = seatLayout.flat().filter((s) => s !== null);
            if (flatSeats.length === 0) {
                return res.status(400).json({ error: "At least one valid seat required after update" });
            }
            screen.seatLayout = seatLayout;
            screen.totalSeats = flatSeats.length;
        }
        await screen.save();
        const updatedScreen = await Screen.findById(id).populate("theaterId");
        res.json(updatedScreen);
    }
    catch (err) {
        console.error('Update screen error:', err.message, err.stack);
        res.status(500).json({ error: err.message });
    }
};
export const deleteScreen = async (req, res) => {
    try {
        const { id } = req.params;
        const screen = await Screen.findById(id);
        if (!screen)
            return res.status(404).json({ message: "Screen not found" });
        await screen.deleteOne();
        res.json({ message: "Screen deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getSeatLayout = async (req, res) => {
    try {
        const { id } = req.params;
        const screen = await Screen.findById(id);
        if (!screen)
            return res.status(404).json({ message: "Screen not found" });
        res.json({
            seatLayout: screen.getSeatLayout(),
            totalSeats: screen.totalSeats
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getSeatsByType = async (req, res) => {
    try {
        const { id, type } = req.params;
        const screen = await Screen.findById(id);
        if (!screen)
            return res.status(404).json({ message: "Screen not found" });
        const seats = screen.getSeatsByType(type);
        res.json({ type, seats, count: seats.length });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getCapacityBreakdown = async (req, res) => {
    try {
        const { id } = req.params;
        const screen = await Screen.findById(id);
        if (!screen)
            return res.status(404).json({ message: "Screen not found" });
        const breakdown = screen.getCapacityBreakdown();
        res.json({ breakdown, totalSeats: screen.totalSeats });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
