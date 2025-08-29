import api from "./api.js";

// Upload file to server
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.fileUrl;
  } catch (error) {
    throw new Error(error.response?.data?.message || "File upload failed");
  }
};
