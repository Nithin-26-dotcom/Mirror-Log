// api/user.js
import api from "./axios";

// Helper to decode JWT token and get user ID
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("No token found");
  }
  
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await api.get("/user/");
  return response.data;
};

// Update current user
export const updateUser = async (data) => {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("No token found");
  }
  
  const response = await api.put(`/user/${userId}`, data);
  return response.data;
};
