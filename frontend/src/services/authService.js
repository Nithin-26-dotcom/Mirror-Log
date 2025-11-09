// services/authService.js
import api from "../api/axios";

// Register new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login user
export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

// Refresh access token
export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};

// Logout user
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
