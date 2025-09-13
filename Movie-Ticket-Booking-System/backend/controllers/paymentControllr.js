import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

// ---------------------------
// Create a payment (initial step)
// ---------------------------
export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    // Validate booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const payment = new Payment({ bookingId, amount, method });
    await payment.save();

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Process payment
// ---------------------------
export const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.processPayment();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Refund payment
// ---------------------------
export const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.refundPayment();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Retry a failed payment
// ---------------------------
export const retryPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.retryPayment();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get payment status
// ---------------------------
export const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json(await payment.getStatus());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all payments (admin use)
// ---------------------------
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("bookingId");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
