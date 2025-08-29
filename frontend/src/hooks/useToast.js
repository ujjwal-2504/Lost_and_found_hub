import { useContext } from "react";
import { ToastContext } from "../components/ToastProvider";

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast, removeToast } = context;

  // Main toast function
  const toast = ({ type, title, message, duration }) => {
    return addToast({ type, title, message, duration });
  };

  // Dismiss function
  const dismiss = (id) => {
    removeToast(id);
  };

  return {
    toast,
    dismiss,
  };
};

export default useToast;
