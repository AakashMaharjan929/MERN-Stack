// controllers/stripeController.js
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================================
// Create Stripe Checkout Session
// ================================
export const createStripeCheckoutSession = async (req, res) => {
  try {
    const {
      amount,
      movieTitle,
      cinemaName,
      showDate,
      showTime,
      seats,
      bookingId,
    } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const userId = req.user?._id || null;

    const transactionUUID = `STRIPE-${Date.now()}`;

    const payment = await Payment.createPendingPayment({
      bookingId,
      userId,
      movieTitle,
      cinemaName,
      showDate: new Date(showDate),
      showTime,
      seats,
      amount,
      paymentMethod: 'stripe',
      transactionUUID,
      pid: `STR-${bookingId.slice(-8).toUpperCase()}`,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'npr',
            product_data: {
              name: `Ticket: ${movieTitle}`,
              description: `${cinemaName} • ${showDate} • ${showTime} • Seats: ${seats.join(', ')}`,
            },
            unit_amount: Math.round(amount * 100), // paisa
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${
        process.env.CLIENT_URL || 'http://localhost:5173'
      }/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.CLIENT_URL || 'http://localhost:5173'
      }/stripe-cancel`,
    });

    return res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      paymentId: payment._id.toString(),
    });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
};

// =================================
// Confirm Stripe Checkout (No Webhook)
// =================================
export const confirmStripeCheckout = async (req, res) => {
  const { sessionId, paymentId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // If already completed, do NOT create booking again
    if (payment.status === 'completed') {
      return res.json({ success: true, message: 'Already confirmed' });
    }

    await payment.markAsCompleted({
      gatewayTransactionId: session.payment_intent,
      gatewayStatus: 'succeeded',
    });

    if (payment.bookingId) {
      await Booking.findByIdAndUpdate(payment.bookingId, { status: 'confirmed' });
    }

    // Create booking ONLY ONCE
    const booking = await Booking.create({
      userId: payment.userId,
      showId: payment.bookingId,
      seatIds: payment.seats,
      totalPrice: payment.amount,
      status: 'Confirmed',
      paymentMethod: 'stripe',
      transactionId: session.payment_intent,
    });

  
    await lockSeats(payment.showId, payment.seats);


    // ✅ SINGLE RESPONSE
    return res.json({
      success: true,
      message: 'Payment and tickets confirmed',
      bookingId: booking._id,
    });

  } catch (err) {
    console.error('Stripe checkout confirm error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



// ==========================================
// Confirm payment after redirect (NO WEBHOOK)
// (OLD PaymentIntent-based flow – NOT USED)
// ==========================================

export const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentId } = req.body;

    if (!paymentIntentId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing data',
      });
    }

    // Retrieve PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful',
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    if (payment.status === 'completed') {
      return res.json({
        success: true,
        message: 'Already confirmed',
      });
    }

    await payment.markAsCompleted({
      gatewayTransactionId: paymentIntentId,
      gatewayStatus: 'succeeded',
    });

    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'confirmed',
    });

    return res.json({
      success: true,
      message: 'Payment confirmed successfully',
    });
  } catch (err) {
    console.error('Stripe confirm error:', err);
    return res.status(500).json({
      success: false,
      message: 'Confirmation failed',
    });
  }
};
