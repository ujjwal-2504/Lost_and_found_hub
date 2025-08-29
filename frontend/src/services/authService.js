import api from "./api.js";

// Register new user
export const register = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Get user profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
