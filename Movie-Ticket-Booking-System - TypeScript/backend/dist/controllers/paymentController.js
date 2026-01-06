import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { v4 as uuidv4 } from "uuid";
const getGatewayRedirectUrl = (payment) => {
    if (payment.paymentMethod === "esewa") {
        const baseUrl = "https://uat.esewa.com.np/epay/main";
        const successUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/payment/success`;
        const failureUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/payment/failed`;
        return `${baseUrl}?amt=${payment.amount}&pid=${payment.pid}&txAmt=0&psc=0&sc=0&tAmt=${payment.amount}&su=${encodeURIComponent(successUrl)}&fu=${encodeURIComponent(failureUrl)}`;
    }
    return "/payment/pending";
};
export const createPayment = async (req, res) => {
    try {
        const { bookingId, showId, movieTitle, cinemaName, showDate, showTime, seats, amount, paymentMethod, } = req.body;
        if (!amount || !paymentMethod) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        let resolvedBookingId = bookingId;
        if (!resolvedBookingId) {
            if (!showId || !Array.isArray(seats) || seats.length === 0) {
                return res.status(400).json({ success: false, message: "bookingId or (showId + seats[]) is required" });
            }
            const show = await Show.findById(showId);
            if (!show)
                return res.status(404).json({ success: false, message: "Show not found" });
            const unavailable = seats.filter((id) => !show.isSeatAvailable(id));
            if (unavailable.length > 0) {
                return res.status(400).json({ success: false, message: `Seats not available: ${unavailable.join(", ")}` });
            }
            const booking = new Booking({ userId: req.user?._id, showId, seatIds: seats, status: "Pending" });
            await booking.calculateTotalPrice();
            await booking.save();
            resolvedBookingId = booking._id;
        }
        const userId = req.user?._id || null;
        const transactionUUID = uuidv4();
        const pid = `TKT-${resolvedBookingId.toString().slice(-8).toUpperCase()}`;
        const payment = await Payment.createPendingPayment({
            bookingId: resolvedBookingId,
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
    }
    catch (err) {
        console.error("createPayment error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const paymentSuccess = async (req, res) => {
    try {
        const { transactionUUID, refId } = (req.body || req.query);
        if (!transactionUUID)
            return res.status(400).json({ success: false, message: "Invalid request" });
        const payment = await Payment.findByTransactionUUID(transactionUUID);
        if (!payment)
            return res.status(404).json({ success: false, message: "Payment not found" });
        if (payment.status === "completed")
            return res.json({ success: true, message: "Already processed" });
        await payment.markAsCompleted({
            gatewayTransactionId: refId || transactionUUID,
            gatewayStatus: "succeeded",
        });
        if (!payment.bookingId) {
            return res.status(400).json({ success: false, message: "Missing booking reference on payment" });
        }
        const booking = await Booking.findById(payment.bookingId);
        if (booking) {
            await booking.confirmBooking();
        }
        res.json({
            success: true,
            message: "Payment successful! Your ticket is ready.",
            ticketId: payment._id,
        });
    }
    catch (err) {
        console.error("paymentSuccess error:", err);
        res.status(500).json({ success: false, message: "Processing failed" });
    }
};
export const paymentFailed = async (req, res) => {
    try {
        const { transactionUUID, reason } = (req.body || req.query);
        if (!transactionUUID)
            return res.status(400).json({ success: false, message: "Invalid request" });
        const payment = await Payment.findByTransactionUUID(transactionUUID);
        if (!payment)
            return res.status(404).json({ success: false, message: "Payment not found" });
        await payment.markAsFailed({
            failureReason: reason || "Payment failed or cancelled",
        });
        res.json({ success: false, message: "Payment failed" });
    }
    catch (err) {
        console.error("paymentFailed error:", err);
        res.status(500).json({ success: false, message: "Processing error" });
    }
};
export const getMyTickets = async (req, res) => {
    try {
        const userId = req.user._id;
        const payments = await Payment.getUserPayments(userId, {
            limit: 20,
            status: "completed",
        });
        const showIds = payments.map((p) => p.showId).filter(Boolean);
        const shows = await Show.find({ _id: { $in: showIds } }).select("startTime status");
        const showMap = new Map(shows.map((s) => [s._id.toString(), s]));
        const tickets = payments.map((p) => {
            const bookingTime = new Date(p.createdAt);
            const show = showMap.get(p.showId?.toString());
            const showStart = show?.startTime ? new Date(show.startTime) : bookingTime;
            const showStatus = show?.status || "Upcoming";
            const now = new Date();
            const minutesSinceBooking = (now.getTime() - bookingTime.getTime()) / (1000 * 60);
            const canRefund = minutesSinceBooking <= 30;
            return {
                id: p._id,
                movieTitle: p.movieTitle,
                showDateTime: `${showStart.toLocaleDateString("en-NP", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })} | ${p.showTime}`,
                showStartTimeISO: showStart.toISOString(),
                showStatus,
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
    }
    catch (err) {
        console.error("getMyTickets error:", err);
        res.status(500).json({ success: false, message: "Failed to load tickets" });
    }
};
export const cancelTicket = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment)
            return res.status(404).json({ message: "Ticket not found" });
        if (payment.userId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (payment.status !== "completed") {
            return res.status(400).json({ message: "Cannot cancel this ticket" });
        }
        const minutesSinceBooking = (Date.now() - new Date(payment.createdAt).getTime()) / 60000;
        if (minutesSinceBooking > 30) {
            return res.status(400).json({ message: "Cancellation window closed (30 minutes)" });
        }
        if (!payment.bookingId) {
            return res.status(400).json({ message: "Missing booking reference for this ticket" });
        }
        const booking = await Booking.findById(payment.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found for this ticket" });
        }
        await booking.cancelBooking();
        await payment.markAsRefunded();
        res.json({ success: true, message: "Ticket cancelled successfully. Refund will be processed soon." });
    }
    catch (err) {
        console.error("cancelTicket error:", err);
        res.status(500).json({ message: "Cancellation failed" });
    }
};
export const getAllPayments = async (req, res) => {
    try {
        const page = parseInt(String(req.query.page || 1), 10) || 1;
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
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
