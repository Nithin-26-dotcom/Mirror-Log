// api/roadmap.js
import api from "./axios";

// Get roadmap by pageId
export const getRoadmapByPage = async (pageId) => {
  const response = await api.get(`/roadmaps/${pageId}`);
  return response.data;
};

// Create a roadmap
export const createRoadmap = async (data) => {
  const response = await api.post("/roadmaps", data);
  return response.data;
};

// Update a roadmap
export const updateRoadmap = async (id, data) => {
  const response = await api.put(`/roadmaps/${id}`, data);
  return response.data;
};

// Delete a roadmap
export const deleteRoadmap = async (id) => {
  const response = await api.delete(`/roadmaps/${id}`);
  return response.data;
};

// Add a todo under a specific subheading
export const addTodo = async (roadmapId, subheadingIndex, todoData) => {
  const response = await api.post(
    `/roadmaps/${roadmapId}/subheading/${subheadingIndex}/todo`,
    todoData
  );
  return response.data;
};

// Toggle todo completion state
export const toggleTodo = async (todoId) => {
  const response = await api.patch(`/roadmaps/todo/${todoId}/toggle`);
  return response.data;
};

// Delete a specific todo
export const deleteTodo = async (roadmapId, subheadingIndex, todoId) => {
  const response = await api.delete(
    `/roadmaps/${roadmapId}/subheading/${subheadingIndex}/todo/${todoId}`
  );
  return response.data;
};
