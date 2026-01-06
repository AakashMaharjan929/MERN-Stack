// theaterAPI.js - Frontend API utility for theater operations (updated with Vite env var)
import axios from 'axios'; // Assume axios is installed

const API_BASE = import.meta.env.VITE_API_URL_Theater; // Fallback to default if env var not set

// Add a new theater
export const addTheater = async (theaterData) => {
  const response = await axios.post(`${API_BASE}/`, theaterData);
  return response.data;
};

// Update a theater
export const updateTheater = async (id, theaterData) => {
  const response = await axios.put(`${API_BASE}/${id}`, theaterData);
  return response.data;
};

// Delete a theater
export const deleteTheater = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};

// Get all theaters
export const getAllTheaters = async () => {
  const response = await axios.get(`${API_BASE}/`);
  return response.data;
};

// Get single theater by ID
export const getTheaterById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

// Add a screen to theater
export const addScreenToTheater = async (theaterId, screenId) => {
  const response = await axios.post(`${API_BASE}/add-screen`, { theaterId, screenId });
  return response.data;
};

// Remove a screen from theater
export const removeScreenFromTheater = async (theaterId, screenId) => {
  const response = await axios.post(`${API_BASE}/remove-screen`, { theaterId, screenId });
  return response.data;
};