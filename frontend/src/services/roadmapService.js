import api from "../api/axios";

// ---------------- ROADMAP ----------------

// Create a roadmap
export const createRoadmap = async (data) => {
  const res = await api.post("/roadmaps", data);
  return res.data;
};

// Get roadmap by pageId
export const getRoadmapByPage = async (pageId) => {
  const res = await api.get(`/roadmaps/${pageId}`);
  return res.data;
};

// Update roadmap (full update of subheadings/todos structure)
export const updateRoadmap = async (roadmapId, updates) => {
  const res = await api.put(`/roadmaps/${roadmapId}`, updates);
  return res.data;
};

// Delete roadmap
export const deleteRoadmap = async (roadmapId) => {
  const res = await api.delete(`/roadmaps/${roadmapId}`);
  return res.data;
};

// ---------------- TODOS ----------------

// Add a todo under a subheading
export const addTodo = async (roadmapId, subheadingIndex, content) => {
  const res = await api.post(
    `/roadmaps/${roadmapId}/subheading/${subheadingIndex}/todo`,
    { content }
  );
  return res.data;
};

// Toggle todo completion
export const toggleTodo = async (todoId) => {
  const res = await api.patch(`/roadmaps/todo/${todoId}/toggle`);
  return res.data;
};

// Delete a todo
export const deleteTodo = async (roadmapId, subheadingIndex, todoId) => {
  const res = await api.delete(
    `/roadmaps/${roadmapId}/subheading/${subheadingIndex}/todo/${todoId}`
  );
  return res.data;
};
