// Updated userAPI.js - Added admin-specific endpoints for customer management
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL_User, 
});

// Existing user-facing endpoints
export const registerUser = (userData) => API.post("/register", userData);

export const loginUser = (credentials) => API.post("/login", credentials);

export const updateUserProfile = (id, data) => API.put(`/update/${id}`, data);

export const changeUserPassword = (id, data) => API.put(`/update/${id}/password`, data);

export const deleteUser = (id) => API.delete(`/delete/${id}`);

export const getUserBookings = (id) => API.get(`/bookings/${id}`);

export const cancelUserBooking = (id, bookingId) => API.post(`/${id}/bookings/cancel`, { bookingId });

// NEW: Admin endpoints for customer management
// Get all users (supports ?page=1&limit=20&search=john&role=admin&status=active)
export const getAllUsers = (params = {}) => API.get('/', { params });

// Get single user by ID (for details/edit)
export const getUserById = (id) => API.get(`/${id}`);

// Update user role/status (e.g., promote to admin, ban)
export const updateUserRole = (id, data) => API.put(`/${id}/role`, data);

// Blacklist/ban user (toggle or set status)
export const blacklistUser = (id, data) => API.put(`/${id}/blacklist`, data);

// Bulk delete users
export const bulkDeleteUsers = (userIds) => API.delete('/bulk', { data: { userIds } });

// Bulk update roles (e.g., for moderation)
export const bulkUpdateRoles = (updates) => API.put('/bulk/roles', updates);