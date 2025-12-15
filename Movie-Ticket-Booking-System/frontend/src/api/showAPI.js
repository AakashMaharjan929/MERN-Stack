// showAPI.js - Frontend API utility for show operations (create in /src/api)
import axios from 'axios';

const showAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL_Show, // Adjust env var as needed
});

// Get all shows (supports query params if needed)
export const getAllShows = async (params = {}) => {
  const response = await showAPI.get('/', { params });
  return response.data;
};

// Get single show by ID
export const getShowById = async (id) => {
  const response = await showAPI.get(`/${id}`);
  return response.data;
};

// Add new show
export const addShow = async (showData) => {
  const response = await showAPI.post('/', showData);
  return response.data;
};

// Bulk create shows
export const bulkCreateShows = async (showDataArray) => {
  const response = await showAPI.post('/bulk', showDataArray);
  return response.data;
};

// Update show
export const updateShow = async (id, showData) => {
  const response = await showAPI.put(`/${id}`, showData);
  return response.data;
};

// Delete show
export const deleteShow = async (id) => {
  const response = await showAPI.delete(`/${id}`);
  return response.data;
};

// Check conflicts (requires screenId, startTime, endTime)
export const checkConflicts = async (screenId, startTime, endTime) => {
  const response = await showAPI.get('/conflicts', {
    params: { screenId, startTime, endTime }
  });
  return response.data;
};

// Suggest factors (requires movieId, startTime)
export const suggestFactors = async (movieId, startTime) => {
  const response = await showAPI.get('/suggest-factors', {
    params: { movieId, startTime }
  });
  return response.data;
};

// Get current dynamic price (requires seatType)
export const getCurrentPrice = async (id, seatType) => {
  const response = await showAPI.get(`/${id}/price`, {
    params: { seatType }
  });
  return response.data;
};

// Get available seats
export const getAvailableSeats = async (id) => {
  const response = await showAPI.get(`/${id}/seats`);
  return response.data;
};

// Book seats
export const bookSeats = async (id, seatIds) => {
  const response = await showAPI.post(`/${id}/book`, { seatIds });
  return response.data;
};

// Cancel booked seats
export const cancelSeats = async (id, seatIds) => {
  const response = await showAPI.post(`/${id}/cancel`, { seatIds });
  return response.data;
};