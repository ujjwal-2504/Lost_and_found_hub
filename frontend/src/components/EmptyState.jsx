// Usage: <EmptyState title="No items found" message="Try again later!" icon={<SearchIcon />} />

import React from "react";

const EmptyState = ({
  title = "No items yet",
  message = null,
  icon = null,
}) => {
  return (
    <div className="flex items-center justify-center min-h-64 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-md mx-auto text-center">
        {/* Icon */}
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="text-gray-400 text-6xl">{icon}</div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>

        {/* Message */}
        {message && (
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
