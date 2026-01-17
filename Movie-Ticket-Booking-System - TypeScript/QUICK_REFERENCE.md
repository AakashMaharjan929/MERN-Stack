# Quick Reference - OOP Models

## Model Methods Quick Lookup

### 🎫 Booking Model

**Creation:**
```typescript
Booking.createBooking({ userId, showId, seatIds })
```

**Status:**
```typescript
booking.confirmBooking()
booking.cancelBooking()
booking.isPending() / .isConfirmed() / .isCancelled()
```

**Pricing:**
```typescript
booking.calculateTotalPrice()
booking.getRefundAmount()
booking.applyDiscount("DISCOUNT10")
```

**Seats:**
```typescript
booking.checkSeatAvailability()
booking.updateSeats(newSeatIds)
booking.getTotalSeats()
```

**Info:**
```typescript
booking.getSummary()
```

**Queries:**
```typescript
Booking.getUserBookings(userId, limit)
Booking.getConfirmedBookingsForShow(showId)
Booking.getExpiredPendingBookings(hoursOld)
```

---

### 👤 User Model

**Creation:**
```typescript
User.createUser({ name, email, phone, password, role })
```

**Auth:**
```typescript
User.login(email, password)
user.checkPassword(password)
user.changePassword(oldPass, newPass)
```

**Profile:**
```typescript
user.updateProfile({ name, email, phone })
user.getProfile()
```

**Roles:**
```typescript
user.isAdmin() / .isTheaterManager() / .isCustomer()
user.hasPermission("book_tickets")
user.getRole()
user.changeRole(newRole)
```

**Status:**
```typescript
user.isActive() / .isBlacklisted()
user.blacklist() / .unblacklist()
```

**Bookings:**
```typescript
user.getBookings(limit, skip)
user.getConfirmedBookings()
user.getPendingBookings()
user.cancelBooking(bookingId)
```

**Queries:**
```typescript
User.findByEmail(email)
User.getAdmins() / .getTheaterManagers() / .getCustomers()
User.getActiveUsers() / .getBlacklistedUsers()
```

---

### 🎬 Movie Model

**Creation:**
```typescript
Movie.addMovie({ title, genre, duration, ... })
```

**Status:**
```typescript
movie.markAsUpcoming() / .markAsNowShowing() / .markAsCompleted()
movie.isUpcoming() / .isNowShowing() / .isCompleted()
```

**Rating:**
```typescript
movie.rateMovie(rating)
movie.getAverageRating()
movie.getRatingPercentage()
movie.isHighlyRated(threshold)
```

**Info:**
```typescript
movie.getFormattedDuration() // "2h 30m"
movie.getDurationInMinutes()
movie.isReleased()
movie.isReleasingSoon()
movie.daysUntilRelease()
movie.getMovieInfo()
```

**Content:**
```typescript
movie.updateMovieDetails({ title, genre, ... })
movie.updatePosters(profilePoster, bannerPoster)
movie.deleteMovie()
```

**Queries:**
```typescript
Movie.findByGenre(genre)
Movie.findByLanguage(language)
Movie.findTopRated(limit)
Movie.findUpcoming(limit)
Movie.searchMovies(query)
Movie.getNowShowing()
Movie.getTrendingMovies(limit)
```

---

### 💳 Payment Model

**Creation:**
```typescript
Payment.createPendingPayment({ bookingId, amount, ... })
```

**Status:**
```typescript
payment.markAsCompleted({ gatewayTransactionId, ... })
payment.markAsFailed({ failureReason })
payment.markAsRefunded()
payment.isPending() / .isCompleted() / .isFailed() / .isRefunded()
```

**Operations:**
```typescript
payment.processPayment()
payment.refundPayment()
payment.retryPayment()
```

**Info:**
```typescript
payment.getSummary()
payment.getReceiptInfo()
payment.getFullDetails()
payment.getFormattedAmount()
```

**Refunds:**
```typescript
payment.getRefundAmount() // Based on policy
payment.getRefundStatus()
```

**Time:**
```typescript
payment.isRecent(minutesThreshold)
payment.isOld(daysThreshold)
```

**Queries:**
```typescript
Payment.findByTransactionUUID(uuid)
Payment.getUserPayments(userId, { limit, skip, status })
Payment.getRefundedPayments()
Payment.getFailedPayments()
Payment.getPaymentsByMethod(method)
Payment.getRevenueForDateRange(startDate, endDate)
```

---

### 🎭 Theater Model

**Creation:**
```typescript
Theater.createTheater({ name, managerId, location })
```

**Screens:**
```typescript
theater.addScreen(screenId)
theater.removeScreen(screenId)
theater.getScreens()
theater.hasScreen(screenId)
theater.getTotalScreens()
```

**Location:**
```typescript
theater.updateDetails(name, location)
theater.updateLocation({ street, city, state, ... })
theater.getFullAddress()
theater.getLocation()
theater.getCity() / .getState()
```

**Info:**
```typescript
theater.getTheaterInfo()
theater.getBasicInfo()
theater.getSummary()
```

**Manager:**
```typescript
theater.getManagerId()
theater.updateManager(newManagerId)
```

**Queries:**
```typescript
Theater.getTheatersByManager(managerId)
Theater.getTheatersByCity(city)
Theater.getTheatersByState(state)
Theater.searchTheaters(query)
Theater.getAllTheaters()
```

---

### 📺 Screen Model

**Creation:**
```typescript
Screen.createScreen({ name, theaterId, seatLayout })
```

**Seats:**
```typescript
screen.calculateTotalSeats()
screen.getTotalSeats()
screen.getSeatsByType(type)
screen.getStandardSeats() / .getPremiumSeats() / .getVIPSeats()
screen.getSeatCountByType(type)
screen.getCapacityBreakdown()
screen.getCapacitySummary()
screen.getSeatInfo(seatNumber)
```

**Layout:**
```typescript
screen.getSeatLayout()
screen.updateSeatLayout(newLayout)
screen.resetSeatLayout(defaultLayout)
```

**Occupancy:**
```typescript
screen.getOccupancyPercentage()
```

**Info:**
```typescript
screen.getScreenInfo()
screen.getBasicInfo()
```

**Queries:**
```typescript
Screen.getScreensByTheater(theaterId)
Screen.getScreenByName(theaterId, name)
```

---

### 🔔 Notification Model

**Creation:**
```typescript
Notification.createNotification({ userId, type, message, bookingId })
Notification.createBookingConfirmation(userId, bookingId, movieTitle)
Notification.createPaymentSuccess(userId, bookingId, amount)
Notification.createPaymentFailure(userId, bookingId, reason)
```

**Status:**
```typescript
notification.markAsRead()
notification.markAsUnread()
notification.isNotificationRead()
notification.isNotificationUnread()
```

**Type Check:**
```typescript
notification.isBookingConfirmation()
notification.isPaymentSuccess() / .isPaymentFailure()
notification.isReminder()
```

**Info:**
```typescript
notification.getSummary()
notification.getFullDetails()
notification.getDisplay()
notification.getTypeLabel()
notification.getTimeSinceSent() // "5m ago"
```

**Time:**
```typescript
notification.isRecent(minutesThreshold)
```

**Queries:**
```typescript
Notification.getUnreadForUser(userId, limit)
Notification.getReadForUser(userId, limit)
Notification.getAllForUser(userId, limit)
Notification.getUnreadCountForUser(userId)
Notification.getByType(userId, type)
Notification.getByBooking(bookingId)
Notification.markAllAsReadForUser(userId)
Notification.deleteOlderThan(days)
```

---

## Common Patterns

### Pattern 1: Create & Get Info
```typescript
const booking = await Booking.createBooking(data);
res.json(booking.getSummary());
```

### Pattern 2: Status Check
```typescript
if (!user.isActive()) {
  throw new Error("User is not active");
}
```

### Pattern 3: Update & Notify
```typescript
await payment.markAsCompleted(data);
// Notification sent automatically in some methods
```

### Pattern 4: Query & Map
```typescript
const movies = await Movie.getTrendingMovies(10);
return movies.map(m => m.getMovieInfo());
```

### Pattern 5: Bulk Operations
```typescript
await Notification.markAllAsReadForUser(userId);
```

---

## Error Handling

All methods throw descriptive errors:
```typescript
try {
  const user = await User.createUser(invalidData);
} catch (error) {
  console.error(error.message); // "Invalid email format"
}
```

---

## Type Safety

All methods are fully typed:
```typescript
const booking: BookingClass = await Booking.createBooking({...});
const movies: MovieClass[] = await Movie.getTrendingMovies(10);
```

---

## Performance Tips

1. **Use query methods** for filtering (built-in pagination)
2. **Use factory methods** for creation (validation included)
3. **Chain status methods** before operations
4. **Cache frequently accessed data**
5. **Use bulk operations** when available

---

**Generated**: January 16, 2026
**Purpose**: Quick reference for model methods
**Completeness**: All methods documented
