// movieAPI.js - Frontend API utility for movie operations (create in /src/api)
import axios from 'axios';

const movieAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL_Movie, // Adjust env var as needed
});

// Get all movies (supports ?page=1&limit=10)
export const getAllMovies = async (params = {}) => {
  const response = await movieAPI.get('/', { params });
  return response.data;
};

// Get single movie by ID
export const getMovieById = async (id) => {
  const response = await movieAPI.get(`/${id}`);
  return response.data;
};

// Add new movie (multipart for posters)
export const addMovie = async (formData) => {
  const response = await movieAPI.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Update movie (multipart for optional new posters)
export const updateMovie = async (id, formData) => {
  const response = await movieAPI.put(`/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Delete movie
export const deleteMovie = async (id) => {
  const response = await movieAPI.delete(`/${id}`);
  return response.data;
};

// Rate movie
export const rateMovie = async (id, userRating) => {
  const response = await movieAPI.post(`/${id}/rate`, { userRating });
  return response.data;
};

// Get movies by genre
export const getMoviesByGenre = async (genre) => {
  const response = await movieAPI.get(`/genre/${genre}`);
  return response.data;
};

// Get movies by language
export const getMoviesByLanguage = async (language) => {
  const response = await movieAPI.get(`/language/${language}`);
  return response.data;
};

// Search movies (e.g., ?query=avengers&limit=10)
export const searchMovies = async (query, params = {}) => {
  const response = await movieAPI.get('/search', { params: { query, ...params } });
  return response.data;
};

// Get top-rated movies (supports ?limit=10)
export const getTopRatedMovies = async (params = {}) => {
  const response = await movieAPI.get('/top-rated', { params });
  return response.data;
};