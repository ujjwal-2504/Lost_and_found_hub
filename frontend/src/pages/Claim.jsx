import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createClaim } from "../services/claimService";
import { getItemById } from "../services/itemService";

const Claim = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const params = new URLSearchParams(location.search);
  const itemIdParam = params.get("itemId") || "";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(!!itemIdParam);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    itemId: itemIdParam,
    identifiers: "",
    notes: "",
  });

  // Fetch item details if itemId is provided
  useEffect(() => {
    const fetchItem = async () => {
      if (!itemIdParam) {
        setLoading(false);
        return;
      }

      try {
        const itemData = await getItemById(itemIdParam);
        setItem(itemData);
      } catch (err) {
        setError("Failed to load item details");
        console.error("Fetch item error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemIdParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check authentication
    if (!user) {
      navigate("/login");
      return;
    }

    // Validate required fields
    if (!formData.itemId.trim()) {
      setError("Item ID is required");
      return;
    }

    if (!formData.identifiers.trim()) {
      setError("Please enter secret identifiers or proof of ownership");
      return;
    }

    try {
      setSubmitting(true);

      await createClaim({
        itemId: formData.itemId.trim(),
        identifiers: formData.identifiers.trim(),
      });

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Create claim error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to submit claim"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Claim Item
          </h1>
          <p className="text-gray-600">
            Provide proof of ownership to claim this item
          </p>
        </div>

        {/* Item Summary */}
        {item && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Item Details
            </h3>
            <div className="flex items-start space-x-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-xl mb-4">✅ Success!</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Claim Submitted Successfully
            </h3>
            <p className="text-green-700 mb-4">
              Your claim has been submitted for admin review. You'll be notified
              once it's processed.
            </p>
            <p className="text-sm text-green-600">
              Redirecting to your profile...
            </p>
          </div>
        ) : (
          /* Claim Form */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item ID Field */}
              {!itemIdParam && (
                <div>
                  <label
                    htmlFor="itemId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Item ID *
                  </label>
                  <input
                    type="text"
                    id="itemId"
                    name="itemId"
                    value={formData.itemId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter the item ID"
                  />
                </div>
              )}

              {/* Secret Identifiers Field */}
              <div>
                <label
                  htmlFor="identifiers"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Secret Identifiers / Proof of Ownership *
                </label>
                <textarea
                  id="identifiers"
                  name="identifiers"
                  value={formData.identifiers}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Provide specific details that prove this item belongs to you (e.g., unique markings, contents, purchase details, etc.)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Important:</span> Do not include
                  full serial numbers publicly. This information will only be
                  visible to administrators for verification.
                </p>
              </div>

              {/* Additional Notes Field */}
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
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Any additional information that might help verify your claim"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Claim...
                    </span>
                  ) : (
                    "Submit Claim"
                  )}
                </button>
              </div>

              {/* Alternative Actions */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Found an item instead?
                </p>
                <Link
                  to="/submit-found"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  Report Found Item
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/found"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Browse Items
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Claim;
