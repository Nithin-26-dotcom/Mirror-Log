// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, logout as logoutAPI } from "../api/auth";
import { getCurrentUser } from "../api/user";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await getCurrentUser();
          if (response.statusCode === 200) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      if (response.statusCode === 200) {
        const token = response.data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
        }
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
