import React, { createContext, useState, useCallback } from "react";

// Toast types
export const toastTypes = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
};

// Create context
const ToastContext = createContext();

// Toast icons
const ToastIcon = ({ type }) => {
  switch (type) {
    case toastTypes.SUCCESS:
      return (
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    case toastTypes.ERROR:
      return (
        <svg
          className="w-5 h-5 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      );
    case toastTypes.INFO:
    default:
      return (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
};

// Individual Toast component
const Toast = ({ toast, onRemove }) => {
  const { id, type, title, message } = toast;

  const getTypeStyles = () => {
    switch (type) {
      case toastTypes.SUCCESS:
        return "border-green-200 bg-green-50";
      case toastTypes.ERROR:
        return "border-red-200 bg-red-50";
      case toastTypes.INFO:
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border ${getTypeStyles()} transform transition-all duration-300 ease-in-out`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ToastIcon type={type} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
            )}
            <p className="text-sm text-gray-700">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => onRemove(id)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add toast function
  const addToast = useCallback(
    ({ type = toastTypes.INFO, title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random();
      const newToast = { id, type, title, message };

      setToasts((prev) => [newToast, ...prev]); // Add to beginning (newest on top)

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  // Remove toast function
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="transform transition-all duration-300 ease-in-out opacity-100 translate-y-0"
            >
              <Toast toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export { ToastContext };
