import Theater from "../models/Theater.js";
export const addTheater = async (req, res) => {
    try {
        const { name, location } = req.body;
        if (!location || typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country) {
            return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
        }
        const theater = new Theater({ name, location });
        await theater.save();
        res.status(201).json(theater);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateTheater = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location } = req.body;
        const theater = await Theater.findById(id);
        if (!theater)
            return res.status(404).json({ message: "Theater not found" });
        if (location && (typeof location !== 'object' || !location.street || !location.city || !location.state || !location.country)) {
            return res.status(400).json({ error: 'Invalid location data: Must include street, city, state, and country' });
        }
        const updated = await theater.updateDetails(name, location);
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteTheater = async (req, res) => {
    try {
        const { id } = req.params;
        const theater = await Theater.findById(id);
        if (!theater)
            return res.status(404).json({ message: "Theater not found" });
        await theater.deleteOne();
        res.json({ message: "Theater deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getAllTheaters = async (_req, res) => {
    try {
        const theaters = await Theater.find().populate("screens");
        const theatersWithAddress = theaters.map((theater) => ({
            ...theater.toObject(),
            fullAddress: theater.getFullAddress ? theater.getFullAddress() : `${theater.location.street}${theater.location.locality ? ', ' + theater.location.locality : ''}, ${theater.location.city}, ${theater.location.state}, ${theater.location.country}`
        }));
        res.json(theatersWithAddress);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getTheaterById = async (req, res) => {
    try {
        const { id } = req.params;
        const theater = await Theater.findById(id).populate("screens");
        if (!theater)
            return res.status(404).json({ message: "Theater not found" });
        const theaterWithAddress = {
            ...theater.toObject(),
            fullAddress: theater.getFullAddress ? theater.getFullAddress() : `${theater.location.street}${theater.location.locality ? ', ' + theater.location.locality : ''}, ${theater.location.city}, ${theater.location.state}, ${theater.location.country}`
        };
        res.json(theaterWithAddress);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const addScreenToTheater = async (req, res) => {
    try {
        const { theaterId, screenId } = req.body;
        const theater = await Theater.findById(theaterId);
        if (!theater)
            return res.status(404).json({ message: "Theater not found" });
        await theater.addScreen(screenId);
        res.json({ message: "Screen added", screens: theater.screens });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const removeScreenFromTheater = async (req, res) => {
    try {
        const { theaterId, screenId } = req.body;
        const theater = await Theater.findById(theaterId);
        if (!theater)
            return res.status(404).json({ message: "Theater not found" });
        await theater.removeScreen(screenId);
        res.json({ message: "Screen removed", screens: theater.screens });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
