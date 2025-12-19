// Updated showController.js - Added suggestFactors with genre-based rules and historical averages
import Show from "../models/Show.js";
import Screen from "../models/Screen.js";
import mongoose from "mongoose"; // Import for ObjectId validation

// New: Suggest factors endpoint
export const suggestFactors = async (req, res) => {
  try {
    const { movieId, startTime } = req.query;
    if (!movieId || !startTime) {
      return res.status(400).json({ message: 'movieId and startTime required' });
    }

    // Validate movieId as ObjectId
    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ message: 'Invalid movieId format' });
    }

    // Validate startTime as parsable date
    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime.getTime())) {
      return res.status(400).json({ message: 'Invalid startTime format' });
    }

    const suggestions = await Show.suggestFactors(movieId, startTime);
    res.json({
      suggestedAlpha: suggestions.alpha,
      suggestedBeta: suggestions.beta,
      rationale: suggestions.rationale
    });
  } catch (err) {
    console.error('Suggest factors error:', err); // Log for debugging
    res.status(500).json({ error: err.message });
  }
};

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
      showType,
    } = req.body;

    console.log('addShow received:', { movieId, screenId, startTime, endTime });  // Log input

    // Validate IDs
    if (!mongoose.isValidObjectId(movieId) || !mongoose.isValidObjectId(screenId)) {
      console.log('ID validation failed:', { movieId, screenId });  // Log failure
      return res.status(400).json({ message: 'Invalid movieId or screenId format' });
    }

    // Validate dates
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedEnd <= parsedStart) {
      console.log('Date validation failed:', { startTime, endTime, parsedStart: parsedStart.toISOString(), parsedEnd: parsedEnd.toISOString() });  // Log failure
      return res.status(400).json({ message: 'Invalid startTime or endTime' });
    }

    // Fetch screen to get seats (with seatType included in layout)
    const screen = await Screen.findById(screenId);
    if (!screen) {
      console.log('Screen not found:', screenId);  // Log
      return res.status(404).json({ message: "Screen not found" });
    }

    // UPDATED: Convert screen seats -> availableSeats (preserve nulls for aisles)
    const flatLayout = screen.seatLayout.flat();
    const nullCount = flatLayout.filter(seat => seat == null).length;
    if (nullCount > 0) {
      console.log(`Preserved ${nullCount} aisles (nulls) in screen ${screenId}`);  // Log for awareness
    }

    const seats = flatLayout.map((seat) => {
      if (seat == null) {
        return null;  // UPDATED: Preserve null for aisles/gaps
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
      availableSeats: seats,  // Includes nulls
      totalSeatCount: seats.filter(s => s != null).length,  // UPDATED: Bookable only (excludes nulls)
    });

    await show.save();
    console.log('Show created successfully:', show._id);  // Success log

    const populatedShow = await Show.findById(show._id).populate("movieId").populate("screenId");
    res.status(201).json(populatedShow);
  } catch (err) {
    console.error('Add show error:', err); // Log for debugging
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all shows
// ---------------------------
// ---------------------------
// Get all shows (with optional status filter)
// ---------------------------
// ---------------------------
// Get all shows (with optional status filter)
// ---------------------------
export const getAllShows = async (req, res) => {
  try {
    const { status, movieId } = req.query;

    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (status && ['Upcoming', 'Live', 'Completed'].includes(status)) {
      filter.status = status;
    }

    let shows = await Show.find(filter)
      .populate("movieId")
      .populate("screenId")
      .sort({ startTime: 1 });

    // ADD THESE CONSOLE LOGS TO SEE WHAT'S BEING SENT
    shows = shows.map(show => {
      const plain = show.toObject();

      const standardPrice = show.calculatePrice('Standard');
      const premiumPrice = show.calculatePrice('Premium');

      plain.currentStandardPrice = standardPrice;
      plain.currentPremiumPrice = premiumPrice;

      // LOG EACH SHOW'S CALCULATED PRICES
      console.log(`[Backend] Sending show ${show._id}:`);
      console.log(`   Standard Price: ${standardPrice} NPR`);
      console.log(`   Premium Price: ${premiumPrice} NPR`);
      console.log(`   Base: ${show.pricingRules.standardBasePrice}, Alpha: ${show.pricingRules.alpha}, Beta: ${show.pricingRules.beta}`);
      console.log(`   Sold seats: ${show.availableSeats.filter(s => s && s.isBooked).length}/${show.totalSeatCount}`);
      console.log(`   Time to show (hours): ${Math.round((new Date(show.startTime) - Date.now()) / (1000 * 60 * 60))}h`);
      console.log('---');

      return plain;
    });

    res.json(shows);
  } catch (err) {
    console.error('Get all shows error:', err);
    res.status(500).json({ error: err.message });
  }
};
// ---------------------------
// Get show by ID
// ---------------------------
export const getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id)
      .populate("movieId")
      .populate("screenId");
    
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Convert to plain object FIRST
    const plainShow = show.toObject();

    // Then call methods on the ORIGINAL document (this is the key fix)
    plainShow.currentStandardPrice = show.calculatePrice('Standard');
    plainShow.currentPremiumPrice = show.calculatePrice('Premium');

    res.json(plainShow);
  } catch (err) {
    console.error('Get show by ID error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Book seats
// ---------------------------
export const bookSeats = async (req, res) => {
  try {
    // ... existing validation

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Enhanced status check
    if (show.status !== 'Upcoming') {
      return res.status(400).json({ 
        message: `Cannot book seats: Show is ${show.status.toLowerCase()}` 
      });
    }

    // Existing time cutoff check (keep it!)
    const now = new Date();
    const bookingCutoff = new Date(show.startTime.getTime() - 15 * 60 * 1000);
    if (now > bookingCutoff) {
      return res.status(400).json({ 
        message: "Booking closed: Less than 15 minutes to show start" 
      });
    }

    await show.bookSeats(seatIds);

    // Optional: Update status to Live if very close (but better done via cron)
    res.json({ success: true, bookedSeats: seatIds });
  } catch (err) {
    console.error('Book seats error:', err);
    res.status(400).json({ error: err.message });
  }
};

// ---------------------------
// Cancel booked seats
// ---------------------------
export const cancelSeats = async (req, res) => {
  try {
    // ... validation

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
  } catch (err) {
    console.error('Cancel seats error:', err);
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

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    if (!seatType || !["Standard", "Premium"].includes(seatType)) {
      return res.status(400).json({ message: "Valid seat type (Standard or Premium) is required" });
    }

    const price = show.calculatePrice(seatType);
    res.json({ currentPrice: price, seatType });
  } catch (err) {
    console.error('Get current price error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get available seats
// ---------------------------
export const getAvailableSeats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.json({ availableSeats: show.getAvailableSeats() });
  } catch (err) {
    console.error('Get available seats error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Delete a show
// ---------------------------
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    await show.deleteShow();
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    console.error('Delete show error:', err);
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

    // Validate IDs if provided
    if (movieId && !mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ message: 'Invalid movieId format' });
    }
    if (screenId && !mongoose.isValidObjectId(screenId)) {
      return res.status(400).json({ message: 'Invalid screenId format' });
    }

    // Validate dates if provided
    if (startTime || endTime) {
      const parsedStart = startTime ? new Date(startTime) : show.startTime;
      const parsedEnd = endTime ? new Date(endTime) : show.endTime;
      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedEnd <= parsedStart) {
        return res.status(400).json({ message: 'Invalid startTime or endTime' });
      }
    }

    // If screenId changed, fetch new screen and update seats while preserving bookings
    let updatedSeats = show.availableSeats;
    if (screenId && screenId !== show.screenId.toString()) {
      const screen = await Screen.findById(screenId);
      if (!screen) return res.status(404).json({ message: "Screen not found" });

      const seatsFromScreen = screen.seatLayout.flat();
      updatedSeats = seatsFromScreen.map((seat) => {  // UPDATED: Preserve nulls
        if (seat == null) {
          return null;  // Aisle/gap
        }
        const existingSeat = show.availableSeats.find(s => s && s.seatNumber === seat.seatNumber);
        return {
          seatNumber: seat.seatNumber,
          seatType: seat.seatType || "Standard",
          isBooked: existingSeat ? existingSeat.isBooked : false, // preserve booking
        };
      });
    }

    await show.updateShow({
      movieId,
      screenId,
      startTime,
      endTime,
      showType: showType || show.showType,
      pricingRules: {
        ...(show.pricingRules || {}),
        standardBasePrice,
        premiumBasePrice,
        alpha: demandFactor,
        beta: timeFactor,
      },
      availableSeats: updatedSeats,
      totalSeatCount: updatedSeats.filter(s => s != null).length,  // UPDATED: Bookable only
    });

    const populatedShow = await Show.findById(show._id).populate("movieId").populate("screenId");
    res.json(populatedShow);
  } catch (err) {
    console.error('Update show error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Bulk create shows (for Bulk Scheduling)
// ---------------------------
export const bulkCreateShows = async (req, res) => {
  try {
    const showDataArray = req.body; // Array of partial show objects

    if (!Array.isArray(showDataArray) || showDataArray.length === 0) {
      return res.status(400).json({ message: "Request body must be a non-empty array of show data" });
    }

    // Basic validation for each item
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
    const populatedShows = await Show.find({ _id: { $in: createdShows.map(s => s._id) } })
      .populate("movieId")
      .populate("screenId");
    res.status(201).json(populatedShows);
  } catch (err) {
    console.error('Bulk create shows error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Check conflicts (for Conflict Checker)
// ---------------------------
export const checkConflicts = async (req, res) => {
  try {
    const { screenId, startTime, endTime } = req.query;

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

    const conflicts = await Show.checkConflicts(screenId, proposedStart, proposedEnd);
    res.json({ conflicts });
  } catch (err) {
    console.error('Check conflicts error:', err);
    res.status(500).json({ error: err.message });
  }
};

// NEW: Manual optimize endpoint (called via POST /show/:id/optimize)
export const optimizeShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }
    if (!show) return res.status(404).json({ message: "Show not found" });
    const result = await show.calculateOptimalFactors();
    res.json({ message: 'Optimized successfully', ...result });
  } catch (err) {
    console.error('Optimize show error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add to showController.js
export const getSeatCounts = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const totalBookable = show.availableSeats.filter(s => s != null).length;
    const available = show.getAvailableSeats().length;
    const booked = show.availableSeats.filter(s => s && s.isBooked).length;

    res.json({ totalBookable, available, booked, fillRate: (booked / totalBookable * 100).toFixed(1) + '%' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: Manual trigger for status update (useful for testing or fallback)
export const refreshShowStatuses = async (req, res) => {
  try {
    await Show.updateAllShowStatuses();
    res.json({ message: "All show statuses updated successfully" });
  } catch (err) {
    console.error('Refresh statuses error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const lockSeats = async (showId, seatNumbers) => {
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