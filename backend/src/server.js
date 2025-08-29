import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import claimRoutes from "./routes/claimRoutes.js"; // Make sure this line exists
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Import middleware
import protect from "./middleware/authMiddleware.js";
import adminCheck from "./middleware/adminMiddleware.js";

// Load environment variables
dotenv.config();

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.resolve("uploads")));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Lost & Found Hub Backend Running" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", protect, uploadRoutes);
app.use("/api/items", protect, itemRoutes);
app.use("/api/claims", protect, claimRoutes); // Make sure this line exists
app.use("/api/admin", protect, adminCheck, adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
