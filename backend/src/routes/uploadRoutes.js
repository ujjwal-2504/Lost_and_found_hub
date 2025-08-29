import express from "express";
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

// TODO: Protect with auth middleware in production
// router.use(protect);

// File upload route
router.post("/api/upload", uploadSingle, uploadFile);

export default router;
