// api/tags.js
import api from "./axios";

// Get tags for a specific page
export const getTagsByPage = async (pageId) => {
  const response = await api.get(`/tags/${pageId}`);
  return response.data;
};

// Get tag by ID
export const getTagById = async (id) => {
  const response = await api.get(`/tags/tag/${id}`);
  return response.data;
};

// Create a new tag
export const createTag = async (data) => {
  const response = await api.post("/tags", data);
  return response.data;
};

// Update a tag
export const updateTag = async (id, data) => {
  const response = await api.patch(`/tags/${id}`, data);
  return response.data;
};

// Delete a tag
export const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};
