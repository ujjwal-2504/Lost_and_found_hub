import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    // In checkAuth function
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");

        if (savedToken && savedToken != "undefined") {
          setToken(savedToken);
          const profileData = await authService.getProfile();
          setUser(profileData.data.user); // ✅ Make sure to access nested data
        }
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (data) => {
    try {
      const result = await authService.register(data);
      // Auto-login after successful registration
      await login({ email: data.email, password: data.password });
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
