import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../services/uploadService";
import { createItem } from "../services/itemService";

const Found = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    category: "Other",
    anonymous: false,
    priority: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        setError("Title and description are required");
        setLoading(false);
        return;
      }

      let imageUrl = "";

      // Upload file if selected
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      // Create item payload
      const itemPayload = {
        ...formData,
        image: imageUrl,
        status: "found",
      };

      // Create item
      await createItem(itemPayload);

      // Success - navigate or show success message
      navigate("/found");
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Report Found Item
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Item Name *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location Found
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Books">Books</option>
                <option value="Clothes">Clothes</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Photo (Optional)
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}

            {/* Checkboxes */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="priority"
                  checked={formData.priority}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Priority Item</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  Report Anonymously
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-md font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Found Item Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Found;
