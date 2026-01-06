import type { Request, Response } from "express";
import User from "../models/User.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const newUser = await User.createUser({ name, email, phone, password, role });
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await (user as any).updateProfile(data);
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const success = await (user as any).changePassword(oldPassword, newPassword);
    if (!success) return res.status(400).json({ message: "Old password incorrect" });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await (user as any).deleteUser();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookings = await (user as any).getBookings();

    const populatedBookings = await Promise.all(
      bookings.map(async (booking: any) => {
        const populated = await booking.populate({
          path: 'showId',
          populate: [
            { path: 'movieId', select: 'title genre language' },
            { path: 'screenId', select: 'name' }
          ]
        });

        return {
          _id: populated._id,
          movieTitle: populated.showId?.movieId?.title || 'Unknown Movie',
          movieName: populated.showId?.movieId?.title || 'Unknown Movie',
          showTime: populated.showId?.startTime,
          seats: populated.seatIds,
          totalAmount: populated.totalPrice,
          status: populated.status,
          bookingDate: populated.bookingDate,
          screenName: populated.showId?.screenId?.name,
          genre: populated.showId?.movieId?.genre,
          language: populated.showId?.movieId?.language
        };
      })
    );

    res.status(200).json({ bookings: populatedBookings });
  } catch (err: any) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const cancelUserBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { bookingId } = req.body as any;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const success = await (user as any).cancelBooking(bookingId);
    if (!success) return res.status(400).json({ message: "Booking not found or cannot cancel" });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search = '', role = '', status = '' } = req.query as any;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
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
        .limit(parseInt(String(limit), 10))
        .select('-password'),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      users,
      pagination: { current: parseInt(String(page), 10), pages: Math.ceil(total / Number(limit)), total }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { role, status } = req.body as any;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role && !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (status && !['active', 'blacklisted'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (role) (user as any).role = role;
    if (status) (user as any).status = status;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const blacklistUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { blacklist = true } = req.body as any;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    (user as any).status = blacklist ? 'blacklisted' : 'active';
    await user.save();

    const action = blacklist ? 'blacklisted' : 'whitelisted';
    res.status(200).json({ message: `User ${action} successfully`, user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkDeleteUsers = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body as any;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "userIds array required" });
    }

    const deleted = await User.deleteMany({ _id: { $in: userIds } });
    res.status(200).json({ message: `${deleted.deletedCount} users deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkUpdateRoles = async (req: Request, res: Response) => {
  try {
    const updates = req.body as any[];

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array required" });
    }

    const results: any[] = [];
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

      (user as any).role = role;
      await user.save();
      results.push({ userId, success: true });
    }

    res.status(200).json({ message: 'Bulk update completed', results });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
