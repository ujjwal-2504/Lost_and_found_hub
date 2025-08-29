import api from "./api";

// Get all items
export const getItems = async () => {
  try {
    const response = await api.get("/items");
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

// Get single item by ID
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create new item
export const createItem = async (payload) => {
  try {
    const response = await api.post("/items", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
