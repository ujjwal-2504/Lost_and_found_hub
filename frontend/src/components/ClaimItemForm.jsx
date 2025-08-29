import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Usage: <ClaimItemForm item={item} onSubmit={handleClaim} />
 */

const ClaimItemForm = ({ item, onSubmit }) => {
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    claimantName: user?.name || "",
    contactInfo: user?.email || user?.phone || "",
    identifiers: "",
    notes: "",
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        claimantName: user.name || "",
        contactInfo: user.email || user.phone || "",
      }));
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (!formData.claimantName.trim()) {
      newErrors.claimantName = "Claimant name is required";
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = "Contact information is required";
    }

    if (!formData.identifiers.trim()) {
      newErrors.identifiers = "Identifier(s) are required to verify ownership";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      const claimData = {
        itemId: item._id,
        claimantName: formData.claimantName.trim(),
        contactInfo: formData.contactInfo.trim(),
        identifiers: formData.identifiers.trim(),
        notes: formData.notes.trim(),
      };

      onSubmit(claimData);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Item</h2>
        {item && (
          <p className="text-gray-600">
            Claiming:{" "}
            <span className="font-medium">{item.title || item.name}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Please provide identifying information to verify your ownership
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Claimant Name */}
        <div>
          <label
            htmlFor="claimantName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Claimant Name *
          </label>
          <input
            type="text"
            id="claimantName"
            name="claimantName"
            value={formData.claimantName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.claimantName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your full name"
          />
          {errors.claimantName && (
            <p className="mt-1 text-sm text-red-600">{errors.claimantName}</p>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <label
            htmlFor="contactInfo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contact Email / Phone *
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.contactInfo ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="your.email@example.com or phone number"
          />
          {errors.contactInfo && (
            <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>
          )}
        </div>

        {/* Identifiers */}
        <div>
          <label
            htmlFor="identifiers"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ownership Identifier(s) *
          </label>
          <textarea
            id="identifiers"
            name="identifiers"
            value={formData.identifiers}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.identifiers ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe unique features, serial numbers, contents, or other identifying information that proves this item belongs to you"
          />
          {errors.identifiers && (
            <p className="mt-1 text-sm text-red-600">{errors.identifiers}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            This information will be used by administrators to verify your
            ownership
          </p>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any additional information about the item or circumstances"
          />
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
                Submitting Claim...
              </span>
            ) : (
              "Submit Claim"
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            Your claim will be reviewed by administrators. False claims may
            result in account suspension.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ClaimItemForm;

// Usage:
// <ClaimItemForm item={item} onSubmit={handleClaim} />
