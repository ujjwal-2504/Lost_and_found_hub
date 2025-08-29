import api from "./api";

// Create a new claim
export const createClaim = async ({ itemId, identifiers }) => {
  try {
    const response = await api.post("/claims", { itemId, identifiers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user's claims
export const getMyClaims = async () => {
  try {
    const response = await api.get("/claims/my");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
