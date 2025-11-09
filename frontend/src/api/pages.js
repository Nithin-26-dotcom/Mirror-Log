// api/pages.js
import api from "./axios";

// Get all pages for logged-in user
export const getPages = async () => {
  const response = await api.get("/pages");
  return response.data;
};

// Get page by ID
export const getPageById = async (id) => {
  const response = await api.get(`/pages/${id}`);
  return response.data;
};

// Create a new page
export const createPage = async (data) => {
  const response = await api.post("/pages", data);
  return response.data;
};

// Update a page
export const updatePage = async (id, data) => {
  const response = await api.patch(`/pages/${id}`, data);
  return response.data;
};

// Delete a page
export const deletePage = async (id) => {
  const response = await api.delete(`/pages/${id}`);
  return response.data;
};
