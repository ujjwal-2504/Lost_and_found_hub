import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    identifiers: {
      type: String,
      required: true,
      maxlength: [500, "Identifiers cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
claimSchema.index({ claimant: 1 });
claimSchema.index({ item: 1 });
claimSchema.index({ status: 1 });

export default mongoose.model("Claim", claimSchema);
