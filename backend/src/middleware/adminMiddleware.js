import User from "../models/User.js";

// Middleware to check if user has admin role
export const adminCheck = async (req, res, next) => {
  try {
    // Check if auth middleware set req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Load user from database
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Optionally attach full user object for use in routes
    req.admin = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin verification",
    });
  }
};

export default adminCheck;
