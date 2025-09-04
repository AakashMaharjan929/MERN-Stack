import User from "../models/User.js";

// -------------------------
// Register User
// -------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const newUser = await User.createUser({ name, email, phone, password, role });
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Login User
// -------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password); // calls static method
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Update Profile
// -------------------------
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await user.updateProfile(data);
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Change Password
// -------------------------
export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const success = await user.changePassword(oldPassword, newPassword);
    if (!success) return res.status(400).json({ message: "Old password incorrect" });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Delete User
// -------------------------
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteUser();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Get User Bookings
// -------------------------
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookings = await user.getBookings();
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Cancel Booking
// -------------------------
export const cancelUserBooking = async (req, res) => {
  try {
    const userId = req.params.id;
    const { bookingId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const success = await user.cancelBooking(bookingId);
    if (!success) return res.status(400).json({ message: "Booking not found or cannot cancel" });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
