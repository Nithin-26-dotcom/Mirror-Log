// services/tagService.js
import api from "../api/axios";

// Create a new tag (custom or default)
export const createTag = async (tagData) => {
  try {
    const res = await api.post("/tags", tagData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// List tags for a page (user must own the page)
export const listTags = async (pageId) => {
  try {
    const res = await api.get(`/tags/${pageId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get tag by ID
export const getTagById = async (id) => {
  try {
    const res = await api.get(`/tags/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update tag (rename etc.)
export const updateTag = async (id, updates) => {
  try {
    const res = await api.patch(`/tags/${id}`, updates);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete tag
export const deleteTag = async (id) => {
  try {
    const res = await api.delete(`/tags/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
