import User from "../models/User.js";
import Item from "../models/Item.js";
import Claim from "../models/Claim.js";

// Get all pending claims for admin review
export const getPendingClaims = async (req, res) => {
  try {
    const pendingClaims = await Claim.find({ status: "pending" })
      .populate("claimant", "name email department year")
      .populate("item", "title category location date")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingClaims,
      message: "Pending claims retrieved successfully",
    });
  } catch (error) {
    console.error("Get pending claims error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pending claims",
    });
  }
};

// Verify claim (approve or reject)
export const verifyClaim = async (req, res) => {
  try {
    const { id: claimId } = req.params;
    const { action, reason } = req.body;

    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either approve or reject",
      });
    }

    const claim = await Claim.findById(claimId)
      .populate("claimant")
      .populate("item");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (action === "approve") {
      // Update claim status
      claim.status = "approved";

      // Update item status and claimedBy
      const item = claim.item;
      item.status = "returned";
      item.claimedBy = claim.claimant._id;

      // Award points to finder if item has a creator (finder)
      if (item.createdBy) {
        const finder = await User.findById(item.createdBy);
        if (finder) {
          finder.points = (finder.points || 0) + 10;
          if (!finder.badges.includes("Helper")) {
            finder.badges.push("Helper");
          }
          await finder.save();
        }
      }

      await claim.save();
      await item.save();

      // Return updated claim with minimal population
      const updatedClaim = await Claim.findById(claimId)
        .populate("claimant", "name email")
        .populate("item", "title category status");

      res.status(200).json({
        success: true,
        data: updatedClaim,
        message: "Claim approved successfully and points awarded to finder",
      });
    } else if (action === "reject") {
      claim.status = "rejected";
      if (reason) {
        claim.rejectionReason = reason;
      }
      await claim.save();

      res.status(200).json({
        success: true,
        data: claim,
        message: "Claim rejected successfully",
      });
    }
  } catch (error) {
    console.error("Verify claim error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying claim",
    });
  }
};

// Get pending found items awaiting approval
export const getPendingFoundItems = async (req, res) => {
  try {
    const pendingItems = await Item.find({ status: "submitted" })
      .populate("createdBy", "name email department year")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingItems,
      message: "Pending found items retrieved successfully",
    });
  } catch (error) {
    console.error("Get pending found items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pending found items",
    });
  }
};

// Approve found item to make it public
export const approveFoundItem = async (req, res) => {
  try {
    const { id: itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Update item status and set approving admin
    item.status = "approved";
    item.approvedBy = req.user; // Admin ID from auth middleware

    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      data: updatedItem,
      message: "Found item approved successfully",
    });
  } catch (error) {
    console.error("Approve found item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while approving found item",
    });
  }
};

// Get leaderboard of top users by points
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $match: { role: { $ne: "admin" } }, // Exclude admin users
      },
      {
        $project: {
          name: 1,
          department: 1,
          year: 1,
          points: { $ifNull: ["$points", 0] }, // Default to 0 if no points
          badges: { $ifNull: ["$badges", []] }, // Default to empty array if no badges
        },
      },
      {
        $sort: { points: -1, createdAt: 1 }, // Sort by points desc, then by creation date
      },
      {
        $limit: 10, // Top 10 users
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
      message: "Leaderboard retrieved successfully",
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leaderboard",
    });
  }
};
