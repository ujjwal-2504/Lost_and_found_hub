import express from "express";
import {
  createClaim,
  getMyClaims,
  getClaimById,
} from "../controllers/claimController.js";

const router = express.Router();

// Create a new claim
router.post("/", createClaim);

// Get current user's claims
router.get("/my", getMyClaims);

// Get single claim by ID
router.get("/:id", getClaimById);

export default router;
