// controllers/esewaController.js
import axios from 'axios';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { lockSeats } from './showController.js'; // Reuse the same lockSeats function used by Stripe
import { v4 as uuidv4 } from 'uuid';

// Initialize eSewa payment (create pending payment record)
const initializeEsewaPayment = async (req, res) => {
  try {
    const {
      showId,
      movieTitle,
      cinemaName,
      showDate,
      showTime,
      seats,
      amount,
    } = req.body;

    if (!showId || !movieTitle || !cinemaName || !showDate || !showTime || !seats || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking details',
      });
    }

    const userId = req.user?._id || null;
    const transactionUUID = uuidv4();

    // Create pending payment record
    const payment = await Payment.createPendingPayment({
      showId,
      userId,
      movieTitle,
      cinemaName,
      showDate: new Date(showDate),
      showTime,
      seats,
      amount,
      paymentMethod: 'esewa',
      transactionUUID,
      pid: transactionUUID,
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      transactionUUID: payment.transactionUUID,
      amount: payment.amount,
    });
  } catch (error) {
    console.error('eSewa initialization error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment initialization',
    });
  }
};

const verifyEsewaPayment = async (req, res) => {
  const { oid, refId, amt } = req.query; // eSewa redirects with query params

  if (!oid || !refId || !amt) {
    return res.status(400).json({
      success: false,
      message: 'Missing payment parameters (oid, refId, amt)',
    });
  }

  try {
    // Step 1: Verify transaction with eSewa API
    const merchantCode = process.env.ESEWA_MERCHANT_CODE;
    const verificationUrl = process.env.ESEWA_VERIFICATION_URL || 'https://uat.esewa.com.np/epay/transrec';

    const formData = new URLSearchParams();
    formData.append('amt', amt);
    formData.append('scd', merchantCode);
    formData.append('rid', refId);
    formData.append('pid', oid);

    const verificationResponse = await axios.post(verificationUrl, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const responseText = verificationResponse.data.trim().toLowerCase();

    if (!responseText.includes('success')) {
      console.log('eSewa verification failed:', responseText);
      return res.status(400).json({
        success: false,
        message: 'Payment could not be verified with eSewa',
      });
    }

    // Step 2: Find the pending payment using transactionUUID (oid = transactionId/pid)
    const payment = await Payment.findOne({
      transactionUUID: oid,
      status: 'pending',
      paymentMethod: 'esewa',
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pending payment not found or already processed',
      });
    }

    // Step 3: Validate amount
    if (parseFloat(payment.amount) !== parseFloat(amt)) {
      await payment.markAsFailed({
        failureReason: 'Amount mismatch during verification',
      });
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch',
      });
    }

    // Step 4: Mark payment as completed
    await payment.markAsCompleted({
      gatewayTransactionId: refId,
      gatewayStatus: 'succeeded',
    });

    // Step 5: Create the actual booking
    const booking = await Booking.create({
      userId: payment.userId,
      showId: payment.showId,
      seatIds: payment.seats,
      totalPrice: payment.amount,
      status: 'Confirmed',
      paymentMethod: 'esewa',
      transactionId: refId,
      paymentRef: refId,
    });

    // Step 6: Lock the seats in the show
    await lockSeats(payment.showId, payment.seats);

    // Step 7: Success response (frontend will read this)
    return res.json({
      success: true,
      message: 'Payment successful! Your tickets are confirmed.',
      bookingId: booking._id,
      refId,
      amount: payment.amount,
      movieTitle: payment.movieTitle,
      cinemaName: payment.cinemaName,
      showDate: payment.showDate,
      showTime: payment.showTime,
      seats: payment.seats,
    });

  } catch (error) {
    console.error('eSewa verification error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
    });
  }
};

export { initializeEsewaPayment, verifyEsewaPayment };