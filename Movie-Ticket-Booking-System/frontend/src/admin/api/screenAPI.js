// screenAPI.js - Frontend API utility for screen operations (create in /src/api)
import axios from 'axios'; // Assume axios is installed

const API_BASE = import.meta.env.VITE_API_URL_Screen; // Fallback to default if env var not set

// Add a new screen
export const addScreen = async (screenData) => {
  const response = await axios.post(`${API_BASE}/`, screenData);
  return response.data;
};

// Get all screens
export const getAllScreens = async () => {
  const response = await axios.get(`${API_BASE}/`);
  return response.data;
};

// Get screen by ID
export const getScreenById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

// Update screen
export const updateScreen = async (id, screenData) => {
  const response = await axios.put(`${API_BASE}/${id}`, screenData);
  return response.data;
};

// Delete screen
export const deleteScreen = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};

// Get seat layout for a screen
export const getSeatLayout = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}/seat-layout`);
  return response.data;
};

// Get seats by type (Standard, Premium, VIP)
export const getSeatsByType = async (id, type) => {
  const response = await axios.get(`${API_BASE}/${id}/seats/${type}`);
  return response.data;
};

// Get capacity breakdown (for reports/management)
export const getCapacityBreakdown = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}/capacity`);
  return response.data;
};