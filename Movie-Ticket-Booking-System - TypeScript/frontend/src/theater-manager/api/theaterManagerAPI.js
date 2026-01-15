import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const theaterManagerAPI = axios.create({
  baseURL: `${API_BASE}/theater-manager`
});

// Add token to requests
theaterManagerAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request to:', config.baseURL + config.url);
  return config;
});

// Log errors
theaterManagerAPI.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Create separate axios instances for movies, screens, and shows (use public endpoints)
const movieAPI = axios.create({
  baseURL: `${API_BASE}/movie`
});

const screenAPI = axios.create({
  baseURL: `${API_BASE}/screen`
});

const showAPI = axios.create({
  baseURL: `${API_BASE}/show`
});

// Add token interceptor to all APIs
[movieAPI, screenAPI, showAPI].forEach(api => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

export const getTheaterDetails = () => theaterManagerAPI.get("/theater");
export const updateTheaterDetails = (data) => theaterManagerAPI.put("/theater", data);

// Shows
export const getMyShows = () => theaterManagerAPI.get("/shows");
export const getShowById = (id) => showAPI.get(`/${id}`);
export const addShow = (showData) => showAPI.post("/", showData);
export const updateShow = (id, showData) => showAPI.put(`/${id}`, showData);
export const deleteShow = (id) => showAPI.delete(`/${id}`);
export const suggestFactors = (movieId, startTime) => 
  showAPI.get("/suggest-factors", { params: { movieId, startTime } });

// Bookings
export const getMyBookings = () => theaterManagerAPI.get("/bookings");

// Reports
export const getRevenueReport = (startDate, endDate) => 
  theaterManagerAPI.get("/revenue-report", { params: { startDate, endDate } });
export const getDashboardStats = () => theaterManagerAPI.get("/dashboard");

// Movies (use public movie endpoint)
export const getAllMovies = () => movieAPI.get("/");

// Screens (get screens for the theater manager's theater)
export const getMyScreens = async () => {
  // First get theater details to get theater ID
  const theaterRes = await getTheaterDetails();
  const theaterId = theaterRes.data?.theater?._id || theaterRes.data?._id;
  
  // Then fetch all screens and filter by theater ID
  const screensRes = await screenAPI.get("/");
  const allScreens = screensRes.data?.screens || screensRes.data || screensRes || [];
  
  // Filter screens that belong to this theater
  const myScreens = Array.isArray(allScreens) 
    ? allScreens.filter(screen => 
        screen.theaterId?._id === theaterId || screen.theaterId === theaterId
      )
    : [];
  
  return { data: myScreens, screens: myScreens };
};

// Screen CRUD operations
export const addScreen = (screenData) => screenAPI.post("/", screenData);
export const updateScreen = (id, screenData) => screenAPI.put(`/${id}`, screenData);
export const deleteScreen = (id) => screenAPI.delete(`/${id}`);
