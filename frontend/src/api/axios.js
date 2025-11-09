// api/axios.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api", // backend base URL
  withCredentials: true, // send cookies (refresh/access tokens if set as cookies)
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for login/register routes
      if (
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/register")
      ) {
        localStorage.removeItem("token");
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        // Attempt token refresh
        await api.post("/auth/refresh");

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
