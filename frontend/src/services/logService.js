// services/logService.js
import api from "../api/axios";

// Create a log
export const createLog = async (logData) => {
  try {
    const res = await api.post("/logs", logData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// List logs (with filters: pageId, tagId, search, from, to, pagination)
export const listLogs = async (params = {}) => {
  try {
    const res = await api.get("/logs", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single log by ID
export const getLogById = async (id) => {
  try {
    const res = await api.get(`/logs/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update log
export const updateLog = async (id, updates) => {
  try {
    const res = await api.patch(`/logs/${id}`, updates);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete log
export const deleteLog = async (id) => {
  try {
    const res = await api.delete(`/logs/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
