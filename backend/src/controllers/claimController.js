import Claim from "../models/Claim.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

// Create a new claim for an item
export const createClaim = async (req, res) => {
  try {
    const { itemId, identifiers } = req.body;

    if (!itemId || !identifiers) {
      return res.status(400).json({
        success: false,
        message: "Item ID and identifiers are required",
      });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Create new claim
    const claim = new Claim({
      claimant: req.user, // Set by auth middleware
      item: itemId,
      identifiers,
      status: "pending",
    });

    const savedClaim = await claim.save();

    res.status(201).json({
      success: true,
      data: savedClaim,
      message: "Claim submitted successfully",
    });
  } catch (error) {
    console.error("Create claim error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating claim",
    });
  }
};

// Get all claims for the current user
export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user })
      .populate("item", "title description category status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: claims,
      message: "Claims retrieved successfully",
    });
  } catch (error) {
    console.error("Get claims error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching claims",
    });
  }
};

// Get single claim by ID
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findById(id)
      .populate("item", "title description category status location")
      .populate("claimant", "name email");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
      message: "Claim retrieved successfully",
    });
  } catch (error) {
    console.error("Get claim error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching claim",
    });
  }
};
