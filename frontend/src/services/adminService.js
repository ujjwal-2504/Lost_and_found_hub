import api from "./api";

// Get pending found items awaiting approval
export const getPendingFoundItems = async () => {
  try {
    const response = await api.get("/admin/found/pending");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Approve a found item
export const approveFoundItem = async (itemId) => {
  try {
    const response = await api.put(`/admin/found/${itemId}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get pending claims awaiting verification
export const getPendingClaims = async () => {
  try {
    const response = await api.get("/admin/claims/pending");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Verify a claim (approve or reject)
export const verifyClaim = async (claimId, action) => {
  try {
    const response = await api.put(`/admin/claims/${claimId}/verify`, {
      action,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get leaderboard of top helpers
export const getLeaderboard = async () => {
  try {
    const response = await api.get("/admin/leaderboard");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
