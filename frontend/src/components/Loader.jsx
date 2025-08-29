// Usage: <Loader text="Loading items..." />

import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        {/* Spinning Circle */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>

        {/* Loading Text */}
        <p className="text-gray-600 text-sm font-medium text-center">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
