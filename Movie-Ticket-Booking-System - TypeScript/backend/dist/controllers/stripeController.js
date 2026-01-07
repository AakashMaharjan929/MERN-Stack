import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { lockSeats } from './showController.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
export const createStripeCheckoutSession = async (req, res) => {
    try {
        const { showId, amount, movieTitle, cinemaName, showDate, showTime, seats, bookingId, } = req.body;
        if (!amount || !showId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY not configured');
            return res.status(500).json({
                success: false,
                message: 'Payment gateway not configured',
            });
        }
        const userId = req.user?._id || null;
        let resolvedBookingId = bookingId;
        let resolvedAmount = amount;
        if (!resolvedBookingId) {
            if (!showId || !Array.isArray(seats) || seats.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'bookingId or (showId + seats[]) is required',
                });
            }
            const show = await Show.findById(showId);
            if (!show) {
                return res.status(404).json({ success: false, message: 'Show not found' });
            }
            const unavailable = seats.filter((id) => !show.isSeatAvailable(id));
            if (unavailable.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Seats not available: ${unavailable.join(', ')}`,
                });
            }
            const booking = new Booking({ userId, showId, seatIds: seats, status: 'Pending' });
            await booking.calculateTotalPrice();
            await booking.save();
            resolvedBookingId = booking._id;
            resolvedAmount = booking.totalPrice;
        }
        const transactionUUID = `STRIPE-${Date.now()}`;
        const payment = await Payment.createPendingPayment({
            showId,
            bookingId: resolvedBookingId,
            userId,
            movieTitle,
            cinemaName,
            showDate: new Date(showDate),
            showTime,
            seats,
            amount: resolvedAmount,
            paymentMethod: 'stripe',
            transactionUUID,
            pid: `STR-${String(showId).slice(-8).toUpperCase()}`,
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'रु.',
                        product_data: {
                            name: `Ticket: ${movieTitle}`,
                            description: `${cinemaName} • ${showDate} • ${showTime} • Seats: ${seats.join(', ')}`,
                        },
                        unit_amount: Math.round(resolvedAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/stripe-cancel`,
        });
        return res.json({
            success: true,
            sessionId: session.id,
            url: session.url,
            paymentId: payment._id.toString(),
        });
    }
    catch (err) {
        console.error('Stripe checkout error:', err.message || err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to create checkout session',
        });
    }
};
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
        const booking = await Booking.create({
            userId: payment.userId,
            showId: payment.showId,
            seatIds: payment.seats,
            totalPrice: payment.amount,
            status: 'Confirmed',
            paymentMethod: 'stripe',
            transactionId: session.payment_intent,
        });
        await lockSeats(payment.showId, payment.seats);
        return res.json({
            success: true,
            message: 'Payment and tickets confirmed',
            bookingId: booking._id,
        });
    }
    catch (err) {
        console.error('Stripe checkout confirm error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const confirmStripePayment = async (req, res) => {
    try {
        const { paymentIntentId, paymentId } = req.body;
        if (!paymentIntentId || !paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Missing data',
            });
        }
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
    }
    catch (err) {
        console.error('Stripe confirm error:', err);
        return res.status(500).json({
            success: false,
            message: 'Confirmation failed',
        });
    }
};
