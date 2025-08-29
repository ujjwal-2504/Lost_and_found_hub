import mongoose from "mongoose";

// Define schema for items (both lost and found)
const itemSchema = new mongoose.Schema(
  {
    // Basic item information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Category of the item
    category: {
      type: String,
      enum: [
        "Electronics",
        "Documents",
        "Books",
        "Clothes",
        "Accessories",
        "Other",
      ],
      default: "Other",
    },

    // Status workflow: submitted → approved → lost/found → claimed → returned
    status: {
      type: String,
      enum: ["submitted", "approved", "lost", "found", "claimed", "returned"],
      default: "submitted",
    },

    // Location where item was lost or found
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },

    // Date when item was lost or found
    date: {
      type: Date,
      default: Date.now,
    },

    // Optional image URL or file path
    image: {
      type: String,
      trim: true,
    },

    // Mark urgent items (ID cards, laptops, wallets)
    priority: {
      type: Boolean,
      default: false,
    },

    // Allow anonymous reporting for found items
    anonymous: {
      type: Boolean,
      default: false,
    },

    // User who submitted this item record
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Admin who approved the item for public listing
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Free-form data for private details (serial numbers, etc.)
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create indexes for better query performance
itemSchema.index({ status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ createdBy: 1 });
itemSchema.index({ date: -1 }); // Most recent first
itemSchema.index({ priority: -1 }); // Priority items first

// Export the model
export default mongoose.model("Item", itemSchema);
