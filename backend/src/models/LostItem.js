import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
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
    dateLost: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["lost", "found", "claimed"],
        message: "Status must be either lost, found, or claimed",
      },
      default: "lost",
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
lostItemSchema.index({ status: 1 });
lostItemSchema.index({ owner: 1 });
lostItemSchema.index({ dateLost: -1 }); // Most recent first

const LostItem = mongoose.model("LostItem", lostItemSchema);

export default LostItem;
