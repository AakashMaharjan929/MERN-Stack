import type { Request, Response } from 'express';
import axios from 'axios';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { lockSeats } from './showController.js';
import { v4 as uuidv4 } from 'uuid';

const initializeEsewaPayment = async (req: Request, res: Response) => {
  try {
    const {
      showId,
      movieTitle,
      cinemaName,
      showDate,
      showTime,
      seats,
      amount,
    } = req.body as any;

    if (!showId || !movieTitle || !cinemaName || !showDate || !showTime || !seats || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking details',
      });
    }

    const userId = (req.user as any)?._id || null;
    const transactionUUID = uuidv4();

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
      transactionUUID: (payment as any).transactionUUID,
      amount: payment.amount,
    });
  } catch (error: any) {
    console.error('eSewa initialization error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment initialization',
    });
  }
};

const verifyEsewaPayment = async (req: Request, res: Response) => {
  const { oid, refId, amt } = req.query as any;

  if (!oid || !refId || !amt) {
    return res.status(400).json({
      success: false,
      message: 'Missing payment parameters (oid, refId, amt)',
    });
  }

  try {
    const merchantCode = process.env.ESEWA_MERCHANT_CODE;
    const verificationUrl = process.env.ESEWA_VERIFICATION_URL || 'https://uat.esewa.com.np/epay/transrec';

    const formData = new URLSearchParams();
    formData.append('amt', String(amt));
    formData.append('scd', merchantCode || '');
    formData.append('rid', String(refId));
    formData.append('pid', String(oid));

    const verificationResponse = await axios.post(verificationUrl, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const responseText = String(verificationResponse.data).trim().toLowerCase();

    if (!responseText.includes('success')) {
      console.log('eSewa verification failed:', responseText);
      return res.status(400).json({
        success: false,
        message: 'Payment could not be verified with eSewa',
      });
    }

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

    if (parseFloat(String(payment.amount)) !== parseFloat(String(amt))) {
      await (payment as any).markAsFailed({
        failureReason: 'Amount mismatch during verification',
      });
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch',
      });
    }

    await (payment as any).markAsCompleted({
      gatewayTransactionId: refId as string,
      gatewayStatus: 'succeeded',
    });

    const booking = await Booking.create({
      userId: payment.userId,
      showId: payment.showId,
      seatIds: (payment as any).seats,
      totalPrice: payment.amount,
      status: 'Confirmed',
      paymentMethod: 'esewa',
      transactionId: refId,
      paymentRef: refId,
    });

    await lockSeats(payment.showId as any, (payment as any).seats);

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
      seats: (payment as any).seats,
    });

  } catch (error: any) {
    console.error('eSewa verification error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
    });
  }
};

export { initializeEsewaPayment, verifyEsewaPayment };
