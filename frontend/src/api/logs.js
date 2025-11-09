// api/logs.js
import api from "./axios";

// Get all logs (with optional filters: pageId, tagId, search, from, to, limit, pageNum)
export const getLogs = async (pageId = null, tagId = null, search = null, from = null, to = null, limit = null, pageNum = null) => {
  const params = {};
  if (pageId) params.pageId = pageId;
  if (tagId) params.tagId = tagId;
  if (search) params.search = search;
  if (from) params.from = from;
  if (to) params.to = to;
  if (limit) params.limit = limit;
  if (pageNum) params.pageNum = pageNum;
  
  const response = await api.get("/logs", { params });
  return response.data;
};

// Get log by ID
export const getLogById = async (id) => {
  const response = await api.get(`/logs/${id}`);
  return response.data;
};

// Create a new log
export const createLog = async (data) => {
  const response = await api.post("/logs", data);
  return response.data;
};

// Update a log
export const updateLog = async (id, data) => {
  const response = await api.patch(`/logs/${id}`, data);
  return response.data;
};

// Delete a log
export const deleteLog = async (id) => {
  const response = await api.delete(`/logs/${id}`);
  return response.data;
};
