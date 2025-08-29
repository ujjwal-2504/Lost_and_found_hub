import React, { useState } from "react";

const LostItemForm = ({ onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    dateLost: "",
    image: null,
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location where item was lost is required";
    }

    if (!formData.dateLost) {
      newErrors.dateLost = "Date lost is required";
    } else {
      const selectedDate = new Date(formData.dateLost);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dateLost = "Date lost cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      // Call parent's onSubmit function if provided
      if (onSubmit) {
        onSubmit({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          dateLost: formData.dateLost,
          image: formData.image,
        });
      } else {
        // Fallback: log to console if no onSubmit provided
        console.log("Lost Item Form Data:", {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          dateLost: formData.dateLost,
          image: formData.image,
        });
        alert("Lost item report submitted successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        location: "",
        dateLost: "",
        image: null,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Report Lost Item
          </h2>
          <p className="text-gray-600">Help us help you find your lost item</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., iPhone 13, Blue Backpack, Car Keys"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
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
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Provide detailed description including color, brand, distinctive features, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location Lost *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Library 2nd floor, Main cafeteria, Parking lot B"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Date Lost */}
            <div>
              <label
                htmlFor="dateLost"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date Lost *
              </label>
              <input
                type="date"
                id="dateLost"
                name="dateLost"
                value={formData.dateLost}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateLost ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dateLost && (
                <p className="mt-1 text-sm text-red-600">{errors.dateLost}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Item Photo (Optional)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload a photo to help others identify your item
              </p>
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    ✓ Selected: {formData.image.name}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  "Report Lost Item"
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Your report will be reviewed and posted publicly to help
                community members assist you.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LostItemForm;
