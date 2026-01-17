# Controller Updates - Using Enhanced OOP Models

## Overview
Guide on how to update controllers to leverage the new OOP model methods.

---

## 1. Booking Controller - Before & After

### BEFORE (Old Procedural Way)
```typescript
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, showId, seatIds } = req.body;

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const unavailable = seatIds.filter((id) => !show.isSeatAvailable(id));
    if (unavailable.length > 0) {
      return res.status(400).json({ message: `Seats not available` });
    }

    const booking = new Booking({ userId, showId, seatIds });
    await booking.calculateTotalPrice();
    await booking.save();

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

### AFTER (New OOP Way)
```typescript
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, showId, seatIds } = req.body;

    // Uses factory method with all validation built-in
    const booking = await Booking.createBooking({
      userId,
      showId,
      seatIds
    });

    res.status(201).json(booking.getSummary());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Uses built-in confirmation logic
    await booking.confirmBooking();
    
    res.json({ message: "Booking confirmed", booking: booking.getSummary() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Uses built-in cancellation with automatic notification
    await booking.cancelBooking();

    res.json({ message: "Booking cancelled", booking: booking.getSummary() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const applyDiscount = async (req: Request, res: Response) => {
  try {
    const { bookingId, code } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Uses built-in discount validation
    if (!booking.isValidDiscountCode(code)) {
      return res.status(400).json({ message: "Invalid discount code" });
    }

    const newPrice = await booking.applyDiscount(code);
    res.json({ message: "Discount applied", newPrice });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRefundAmount = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Uses built-in refund calculation
    const refundAmount = booking.getRefundAmount();

    res.json({ refundAmount, bookingTotal: booking.totalPrice });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    // Uses built-in query method
    const bookings = await Booking.getUserBookings(
      userId,
      parseInt(limit as string)
    );

    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

### Benefits:
✅ Controllers are now thin and clean
✅ Validation happens in the model layer
✅ Notifications sent automatically
✅ Less code duplication
✅ Easier to test and maintain

---

## 2. User Controller - Before & After

### BEFORE
```typescript
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, phone, password: hashedPassword });
    
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
```

### AFTER
```typescript
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    // Factory method with all validation built-in
    const newUser = await User.createUser({
      name,
      email,
      phone,
      password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.getProfile()
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Built-in authentication with blacklist check
    const user = await User.login(email, password);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: user.getProfile()
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Built-in password change with validation
    const success = await user.changePassword(oldPassword, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Built-in method to get user's bookings
    const bookings = await user.getBookings(
      parseInt(limit as string),
      parseInt(skip as string)
    );

    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const blacklistUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Built-in blacklist with automatic status update
    await user.blacklist("Suspicious activity");

    res.json({ message: "User blacklisted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
```

---

## 3. Payment Controller - Before & After

### BEFORE
```typescript
export const completePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    payment.gatewayTransactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    res.json({ message: "Payment completed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

### AFTER
```typescript
export const completePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, transactionId, gatewayStatus } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Built-in completion with validation
    await payment.markAsCompleted({
      gatewayTransactionId: transactionId,
      gatewayStatus
    });

    res.json({
      message: "Payment completed",
      receipt: payment.getReceiptInfo()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Built-in refund with validation and calculation
    const refundAmount = payment.getRefundAmount();
    await payment.refundPayment();

    res.json({
      message: "Payment refunded",
      refundAmount,
      status: payment.getRefundStatus()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    // Built-in query method
    const payments = await Payment.getUserPayments(userId, {
      limit: parseInt(limit as string),
      skip: parseInt(skip as string)
    });

    res.json(payments.map(p => p.getSummary()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDailyRevenue = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Built-in analytics method
    const revenue = await Payment.getRevenueForDateRange(today, tomorrow);

    res.json({ date: today, revenue });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## 4. Notification Controller - Examples

### AFTER (New OOP Way)
```typescript
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    // Built-in query method
    const notifications = await Notification.getAllForUser(
      userId,
      parseInt(limit as string)
    );

    res.json(notifications.map(n => n.getDisplay()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Built-in unread query
    const unread = await Notification.getUnreadForUser(userId);
    const count = await Notification.getUnreadCountForUser(userId);

    res.json({
      count,
      notifications: unread.map(n => n.getDisplay())
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Built-in mark as read
    await notification.markAsRead();

    res.json({ message: "Marked as read" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Built-in bulk update
    await Notification.markAllAsReadForUser(userId);

    res.json({ message: "All notifications marked as read" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## 5. Movie Controller - Examples

### AFTER (New OOP Way)
```typescript
export const getNowShowing = async (req: Request, res: Response) => {
  try {
    // Built-in query method
    const movies = await Movie.getNowShowing();

    res.json(movies.map(m => m.getBasicInfo()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrending = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    // Built-in trending query
    const movies = await Movie.getTrendingMovies(parseInt(limit as string));

    res.json(movies.map(m => m.getMovieInfo()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    // Built-in search method
    const movies = await Movie.searchMovies(
      q as string,
      parseInt(limit as string)
    );

    res.json(movies.map(m => m.getMovieInfo()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const rateMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Built-in rating with validation
    const newRating = await movie.rateMovie(rating);

    res.json({
      message: "Rating added",
      newRating: movie.getAverageRating(),
      totalVotes: movie.getTotalVotes()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMovieStatus = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { status } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Built-in status management
    if (status === "Now Showing") {
      await movie.markAsNowShowing();
    } else if (status === "Upcoming") {
      await movie.markAsUpcoming();
    } else if (status === "Completed") {
      await movie.markAsCompleted();
    }

    res.json({ message: "Status updated", status: movie.getStatus() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## Controller Refactoring Checklist

### For Each Controller:
- [ ] Replace manual validation with model validation methods
- [ ] Use factory methods for object creation (e.g., `createUser()`, `createBooking()`)
- [ ] Replace status checks with model methods (e.g., `isCompleted()`, `isAdmin()`)
- [ ] Use query methods instead of raw MongoDB queries
- [ ] Return model summary/info methods instead of raw objects
- [ ] Handle errors from model methods

### Example Pattern:
```typescript
// ❌ OLD: Manual everything
const booking = new Booking(data);
booking.status = "Confirmed";
booking.totalPrice = calculatePrice(...);
await booking.save();

// ✅ NEW: Use model methods
const booking = await Booking.createBooking(data);
await booking.confirmBooking();
```

---

## Performance Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Code Lines** | ~20 | ~5 |
| **Error Handling** | Scattered | Centralized |
| **Validation** | In controller | In model |
| **Reusability** | Low | High |
| **Testing** | Hard | Easy |
| **Maintainability** | Difficult | Easy |

---

## Summary

By using the enhanced OOP models:

1. **Controllers become thin** - Focus on HTTP handling
2. **Models become rich** - Encapsulate business logic
3. **Code is DRY** - No duplication
4. **Errors are consistent** - Centralized error handling
5. **Features are testable** - Unit test model methods
6. **Scalability improves** - Easy to add new features

This follows the **Fat Model, Thin Controller** pattern, which is a SOLID principle best practice.
