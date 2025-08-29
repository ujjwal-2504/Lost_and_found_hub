import React, { useEffect, useState } from "react";
import ClaimItemForm from "./ClaimItemForm";
import useToast from "../hooks/useToast";

const ItemModal = ({ isOpen, onClose, item, onClaim }) => {
  const { toast } = useToast();

  // Toggle between item details and claim form
  const [isClaiming, setIsClaiming] = useState(false);

  // Reset claim form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsClaiming(false);
    }
  }, [isOpen]);

  // Handle Esc key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle claim form submission
  const handleClaim = (formData) => {
    console.log("Claim form submitted:", formData);

    // Show success toast
    toast({
      type: "SUCCESS",
      message: "Claim submitted successfully!",
    });

    // Reset state and close modal
    setIsClaiming(false);
    onClose();

    // Call parent onClaim if provided (for backward compatibility)
    if (onClaim) {
      onClaim(item);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Modal positioning */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Close button - top right */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal content */}
          {!isClaiming ? (
            // Item Details View
            item ? (
              <div>
                {/* Header */}
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 pr-8"
                      id="modal-title"
                    >
                      {item.title || item.name || "Item Details"}
                    </h3>

                    {/* Category and Date */}
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category || "Uncategorized"}
                      </span>
                      <span className="text-gray-500">
                        {item.type === "found" ? "Found on" : "Lost on"}:{" "}
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item Image */}
                {item.image && (
                  <div className="mt-4">
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description || "No description provided."}
                  </p>
                </div>

                {/* Location */}
                {item.location && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Location
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center">
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
                      {item.location}
                    </p>
                  </div>
                )}

                {/* Priority indicator */}
                {item.priority && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      PRIORITY ITEM
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                  {/* Claim button - only for found items */}
                  {item.type === "found" && (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsClaiming(true)}
                    >
                      Claim This Item
                    </button>
                  )}

                  {/* Close button */}
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state when no item */
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📦</div>
                <p className="text-gray-500">No item details available</p>
                <button
                  type="button"
                  className="mt-4 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            )
          ) : (
            // Claim Form View
            <div className="mt-3">
              {/* Back button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setIsClaiming(false)}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Item Details
                </button>
              </div>

              {/* Claim Form */}
              <div className="-mx-4 -mb-4">
                <ClaimItemForm item={item} onSubmit={handleClaim} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
