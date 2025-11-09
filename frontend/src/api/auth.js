// api/auth.js
import api from "./axios";

// Register new user
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Logout user
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Refresh access token
export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};
