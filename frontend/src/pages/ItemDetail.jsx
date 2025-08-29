import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItemById } from "../services/itemService";
import { useAuth } from "../context/AuthContext";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError("Failed to load item details");
        console.error("Fetch item error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Item not found</p>
          <Link
            to="/browse-found"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Back to Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image */}
          {item.image ? (
            <div className="h-96 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-2">📷</div>
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{item.title}</h1>
              {item.priority && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  PRIORITY
                </span>
              )}
            </div>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {item.category}
              </span>
              <span>Found on {formatDate(item.date)}</span>
              <span className="capitalize bg-gray-100 px-3 py-1 rounded-full">
                {item.status}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Location */}
            {item.location && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Location Found</h3>
                <div className="flex items-center text-gray-700">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {item.location}
                </div>
              </div>
            )}

            {/* Finder info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Reported By</h3>
              <p className="text-gray-700">
                {item.anonymous
                  ? "Anonymous Good Samaritan"
                  : item.createdBy?.name || "Unknown"}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <button
                  onClick={() => navigate(`/claim?itemId=${item._id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none"
                >
                  Claim This Item
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-center flex-1 sm:flex-none"
                >
                  Login to Claim
                </Link>
              )}

              <Link
                to="/submit-found"
                className="border-2 border-green-500 text-green-500 hover:bg-green-50 px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-center flex-1 sm:flex-none"
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-6">
          <Link
            to="/browse-found"
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

export default ItemDetail;
