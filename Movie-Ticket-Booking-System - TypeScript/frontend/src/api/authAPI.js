import axios from "axios";

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL_Auth, 
});

// Send OTP to email
export const sendOTP = async (data) => {
  const response = await authAPI.post('/send-otp', data);
  return response;
};

// Verify OTP
export const verifyOTP = async (data) => {
  const response = await authAPI.post('/verify-otp', data);
  return response;
};

//Login
export const loginUser = (credentials) => authAPI.post("/login", credentials);