// controllers/paymentController.js
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import { v4 as uuidv4 } from "uuid";

// Helper for gateway redirect URL
const getGatewayRedirectUrl = (payment) => {
  if (payment.paymentMethod === "esewa") {
    const baseUrl = "https://uat.esewa.com.np/epay/main"; // Use https://esewa.com.np for production
    const successUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/payment/success`;
    const failureUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/payment/failed`;

    return `${baseUrl}?amt=${payment.amount}&pid=${payment.pid}&txAmt=0&psc=0&sc=0&tAmt=${payment.amount}&su=${encodeURIComponent(successUrl)}&fu=${encodeURIComponent(failureUrl)}`;
  }
  return "/payment/pending"; // fallback
};

// Create pending payment
export const createPayment = async (req, res) => {
  try {
    const {
      bookingId,
      showId,
      movieTitle,
      cinemaName,
      showDate,
      showTime,
      seats,
      amount,
      paymentMethod,
    } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userId = req.user?._id || null;
    const transactionUUID = uuidv4();
    const pid = `TKT-${bookingId.toString().slice(-8).toUpperCase()}`;

    const payment = await Payment.createPendingPayment({
      showId,
      userId,
      movieTitle,
      cinemaName,
      showDate: new Date(showDate),
      showTime,
      seats,
      amount,
      paymentMethod,
      transactionUUID,
      pid,
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      transactionUUID: payment.transactionUUID,
      amount: payment.amount,
      pid: payment.pid,
      redirectUrl: getGatewayRedirectUrl(payment),
    });
  } catch (err) {
    console.error("createPayment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Success callback
export const paymentSuccess = async (req, res) => {
  try {
    const { transactionUUID, refId } = req.body || req.query;
    if (!transactionUUID) return res.status(400).json({ success: false, message: "Invalid request" });

    const payment = await Payment.findByTransactionUUID(transactionUUID);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (payment.status === "completed") return res.json({ success: true, message: "Already processed" });

    await payment.markAsCompleted({
      gatewayTransactionId: refId || transactionUUID,
      gatewayStatus: "succeeded",
    });

    await Booking.findByIdAndUpdate(payment.bookingId, { status: "confirmed" });

    res.json({
      success: true,
      message: "Payment successful! Your ticket is ready.",
      ticketId: payment._id,
    });
  } catch (err) {
    console.error("paymentSuccess error:", err);
    res.status(500).json({ success: false, message: "Processing failed" });
  }
};

// Failed callback
export const paymentFailed = async (req, res) => {
  try {
    const { transactionUUID, reason } = req.body || req.query;
    if (!transactionUUID) return res.status(400).json({ success: false, message: "Invalid request" });

    const payment = await Payment.findByTransactionUUID(transactionUUID);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    await payment.markAsFailed({
      failureReason: reason || "Payment failed or cancelled",
    });

    res.json({ success: false, message: "Payment failed" });
  } catch (err) {
    console.error("paymentFailed error:", err);
    res.status(500).json({ success: false, message: "Processing error" });
  }
};

// Get user's tickets (with canRefund logic)
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.getUserPayments(userId, {
      limit: 20,
      status: "completed",
    });

    const tickets = payments.map((p) => {
      const bookingTime = new Date(p.createdAt);
      const now = new Date();
      const minutesSinceBooking = (now - bookingTime) / (1000 * 60);
      const canRefund = minutesSinceBooking <= 30; // 30-minute cancellation window

      return {
        id: p._id,
        movieTitle: p.movieTitle,
        showDateTime: `${bookingTime.toLocaleDateString("en-NP", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })} | ${p.showTime}`,
        auditorium: p.cinemaName,
        screen: "Screen 1",
        seat: p.seats.join(", "),
        showType: "Standard Show",
        price: `NPR ${p.amount.toFixed(2)}`,
        grandTotal: `NPR ${p.amount.toFixed(2)}`,
        barcodeValue: p._id.toString().slice(-12).padStart(12, "0"),
        cinema: {
          name: p.cinemaName,
          address: "Rising Mall, Durbar Marg, Kathmandu",
          phone: "01-4169201 / 4169202",
          website: "www.yourcinema.com",
        },
        notes: {
          inclusive: "+ Inclusive of 13% VAT.",
          glasses: "+ 3D Glasses Rs 50 Extra (if applicable).",
          nepali: "+ Inclusive of 13% VAT. Nepali Movies",
        },
        canRefund,
        minutesLeft: canRefund ? Math.max(0, Math.ceil(30 - minutesSinceBooking)) : 0,
      };
    });

    res.json({ success: true, tickets });
  } catch (err) {
    console.error("getMyTickets error:", err);
    res.status(500).json({ success: false, message: "Failed to load tickets" });
  }
};

// Cancel & Refund (30-minute window)
export const cancelTicket = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Ticket not found" });

    if (payment.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Cannot cancel this ticket" });
    }

    const minutesSinceBooking = (Date.now() - new Date(payment.createdAt)) / 60000;
    if (minutesSinceBooking > 30) {
      return res.status(400).json({ message: "Cancellation window closed (30 minutes)" });
    }

    await payment.markAsRefunded();
    await Booking.findByIdAndUpdate(payment.bookingId, { status: "cancelled" });

    // TODO: In future, integrate with eSewa/Khalti refund API

    res.json({ success: true, message: "Ticket cancelled successfully. Refund will be processed soon." });
  } catch (err) {
    console.error("cancelTicket error:", err);
    res.status(500).json({ message: "Cancellation failed" });
  }
};

// Admin: Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email");

    const total = await Payment.countDocuments();

    res.json({
      success: true,
      payments,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};