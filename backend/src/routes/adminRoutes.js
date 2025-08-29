import express from "express";
import {
  getPendingClaims,
  verifyClaim,
  getPendingFoundItems,
  approveFoundItem,
  getLeaderboard,
} from "../controllers/adminController.js";

const router = express.Router();

// TODO: Protect all routes with `protect` and `adminCheck` middleware
// Example: router.use(protect); router.use(adminCheck);

// Get pending claims for admin review
router.get("/claims/pending", getPendingClaims);

// Verify claim (approve/reject)
router.put("/claims/:id/verify", verifyClaim);

// Get pending found items awaiting approval
router.get("/found/pending", getPendingFoundItems);

// Approve found item to make it public
router.put("/found/:id/approve", approveFoundItem);

// Get leaderboard of top users by points
router.get("/leaderboard", getLeaderboard);

export default router;
