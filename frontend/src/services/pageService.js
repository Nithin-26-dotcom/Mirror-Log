import api from "../api/axios";

// Create a new page
export const createPage = async (pageData) => {
  const res = await api.post("/pages", pageData);
  return res.data;
};

// List all pages of the logged-in user
export const listMyPages = async () => {
  const res = await api.get("/pages");
  return res.data;
};

// Get a single page by ID
export const getPageById = async (pageId) => {
  const res = await api.get(`/pages/${pageId}`);
  return res.data;
};

// Update a page
export const updatePage = async (pageId, updates) => {
  const res = await api.patch(`/pages/${pageId}`, updates);
  return res.data;
};

// Delete a page
export const deletePage = async (pageId) => {
  const res = await api.delete(`/pages/${pageId}`);
  return res.data;
};
