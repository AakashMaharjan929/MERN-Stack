// bookingAPI.js - Frontend API utility for booking operations (updated with Vite env var)
import axios from 'axios'; // Assume axios is installed

const API_BASE = import.meta.env.VITE_API_URL_Booking; // Fallback to default if env var not set

// Create a new booking (Pending)
export const createBooking = async (bookingData) => {
  const response = await axios.post(`${API_BASE}/`, bookingData);
  return response.data;
};

// Confirm a booking
export const confirmBooking = async (id) => {
  const response = await axios.post(`${API_BASE}/${id}/confirm`);
  return response.data;
};

// Cancel a booking
export const cancelBooking = async (id) => {
  const response = await axios.post(`${API_BASE}/${id}/cancel`);
  return response.data;
};

// Update seats in a booking
export const updateSeats = async (id, newSeatIds) => {
  const response = await axios.put(`${API_BASE}/${id}/seats`, { newSeatIds });
  return response.data;
};

// Apply discount to a booking
export const applyDiscount = async (id, code) => {
  const response = await axios.post(`${API_BASE}/${id}/discount`, { code });
  return response.data;
};

// Get single booking by ID
export const getBookingById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

// Get all bookings (with optional query params for filters/pagination)
export const getAllBookings = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/`, { params });
  return response.data;
};

// Get cancellations/refunds (with optional query params for filters/pagination)
export const getCancellations = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/cancellations`, { params });
  return response.data;
};

// Get ticket history (with optional query params for filters/pagination)
export const getTicketHistory = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/history`, { params });
  return response.data;
};

// Get revenue breakdown (with optional query params for grouping/filters)
export const getRevenueBreakdown = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/revenue`, { params });
  return response.data;
};