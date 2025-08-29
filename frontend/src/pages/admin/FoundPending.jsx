import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPendingFoundItems,
  approveFoundItem,
} from "../../services/adminService";

const FoundPending = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getPendingFoundItems();
        setItems(data);
      } catch (err) {
        setError("Failed to load pending found items");
        console.error("Fetch items error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleApprove = async (itemId) => {
    if (!window.confirm("Are you sure you want to approve this found item?")) {
      return;
    }

    try {
      await approveFoundItem(itemId);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      alert("Item approved successfully! It's now visible to the public.");
    } catch (err) {
      console.error("Approve error:", err);
      alert("Error approving item. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Pending Found Items
              </h1>
              <p className="text-gray-600">
                Review and approve items reported by community members
              </p>
            </div>
            <Link
              to="/admin"
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
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Pending Items
            </h3>
            <p className="text-gray-600">
              All found items have been reviewed and approved!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Image */}
                {item.image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl">📷</div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.priority && (
                      <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        PRIORITY
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {item.description}
                  </p>

                  {item.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}

                  <div className="mb-4 text-sm text-gray-600">
                    <p>
                      <strong>Found on:</strong> {formatDate(item.date)}
                    </p>
                    <p>
                      <strong>Reported by:</strong>{" "}
                      {item.anonymous
                        ? "Anonymous"
                        : item.createdBy?.name || "Unknown"}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleApprove(item._id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
                  >
                    Approve Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundPending;
