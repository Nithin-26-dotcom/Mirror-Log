import axios from "axios";

/**
 * Resolve backend base URL:
 * - Uses Vite env var VITE_API_BASE_URL when available (recommended)
 * - Falls back to localhost in dev (when running on localhost)
 * - Otherwise uses the deployed backend URL
 */
const baseURL =
  import.meta?.env?.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)
    ? "http://localhost:8000/api"
    : "https://mirror-log.onrender.com/api");

// Create axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies (refresh/access tokens if set as cookies)
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to safely read request url for checks (works with absolute and relative URLs)
const getRequestPath = (reqConfig) => {
  if (!reqConfig) return "";
  // axios may have full URL in `url` or `baseURL + url` combination
  try {
    const u = new URL(reqConfig.url, reqConfig.baseURL || baseURL);
    return u.pathname + u.search;
  } catch {
    return reqConfig.url || "";
  }
};

// Response interceptor for handling expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not retried already
    if (error.response?.status === 401 && !originalRequest?._retry) {
      const path = getRequestPath(originalRequest);

      // Skip refresh for login/register routes
      if (path.includes("/auth/login") || path.includes("/auth/register")) {
        localStorage.removeItem("token");
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        // Attempt token refresh (refresh endpoint should set cookie or return new token)
        await api.post("/auth/refresh");

        // Retry the original request (token should now be refreshed)
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear token and redirect to login
        localStorage.removeItem("token");
        // Use location replace to avoid creating history entry
        if (typeof window !== "undefined") window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
