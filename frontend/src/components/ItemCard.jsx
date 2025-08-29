import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Truncate description to ~120 characters
  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      {item.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Header with title and priority */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
            {item.title}
          </h3>
          {item.priority && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
              PRIORITY
            </span>
          )}
        </div>

        {/* Category and Date */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {item.category}
          </span>
          <span>{formatDate(item.date)}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
          {truncateText(item.description)}
        </p>

        {/* Location */}
        {item.location && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
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

        {/* Action Button */}
        <Link
          to={`/claim?itemId=${item._id}`}
          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
        >
          View / Claim
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
