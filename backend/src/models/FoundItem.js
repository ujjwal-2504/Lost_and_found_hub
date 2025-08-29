import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dateFound: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    finder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Finder is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["submitted", "listed", "claimed"],
        message: "Status must be either submitted, listed, or claimed",
      },
      default: "submitted",
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
foundItemSchema.index({ status: 1 });
foundItemSchema.index({ finder: 1 });
foundItemSchema.index({ dateFound: -1 }); // Most recent first

const FoundItem = mongoose.model("FoundItem", foundItemSchema);

export default FoundItem;
