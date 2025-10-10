import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL_User, 
});

// Register a new user
export const registerUser = (userData) => API.post("/register", userData);

// Login user
export const loginUser = (credentials) => API.post("/login", credentials);

// Update user profile
export const updateUserProfile = (id, data) => API.put(`/update/${id}`, data);

// Change password
export const changeUserPassword = (id, data) => API.put(`/update/${id}/password`, data);

// Delete user
export const deleteUser = (id) => API.delete(`/delete/${id}`);

// Get bookings
export const getUserBookings = (id) => API.get(`/bookings/${id}`);

// Cancel booking
export const cancelUserBooking = (id, bookingId) => API.post(`/${id}/bookings/cancel`, { bookingId });
