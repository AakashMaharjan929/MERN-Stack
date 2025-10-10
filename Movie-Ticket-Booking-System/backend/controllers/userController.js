// Updated userController.js - Added admin-specific endpoints for customer management
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

// -------------------------
// NEW: Admin - Get All Users (with pagination/search/filter)
// -------------------------
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password'), // Exclude sensitive fields
      User.countDocuments(query)
    ]);

    res.status(200).json({
      users,
      pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// NEW: Admin - Get Single User by ID
// -------------------------
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// NEW: Admin - Update User Role/Status
// -------------------------
export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, status } = req.body; // e.g., { role: 'admin' } or { status: 'blacklisted' }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role && !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (status && !['active', 'blacklisted'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// NEW: Admin - Blacklist User (toggle or set)
// -------------------------
export const blacklistUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { blacklist = true } = req.body; // Default to blacklist if not specified

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = blacklist ? 'blacklisted' : 'active';
    await user.save();

    const action = blacklist ? 'blacklisted' : 'whitelisted';
    res.status(200).json({ message: `User ${action} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// NEW: Admin - Bulk Delete Users
// -------------------------
export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "userIds array required" });
    }

    const deleted = await User.deleteMany({ _id: { $in: userIds } });
    res.status(200).json({ message: `${deleted.deletedCount} users deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// NEW: Admin - Bulk Update Roles
// -------------------------
export const bulkUpdateRoles = async (req, res) => {
  try {
    const updates = req.body; // e.g., [{ userId: 'id1', role: 'admin' }, ...]

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array required" });
    }

    const results = [];
    for (const update of updates) {
      const { userId, role } = update;
      if (!userId || !role || !['customer', 'admin'].includes(role)) {
        results.push({ userId, error: 'Invalid update' });
        continue;
      }

      const user = await User.findById(userId);
      if (!user) {
        results.push({ userId, error: 'User not found' });
        continue;
      }

      user.role = role;
      await user.save();
      results.push({ userId, success: true });
    }

    res.status(200).json({ message: 'Bulk update completed', results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};