import Item from "../models/Item.js";

// Create a new item
export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      status,
      priority,
      anonymous,
      image,
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Create new item
    const newItem = new Item({
      title,
      description,
      category: category || "Other",
      location,
      date: date || Date.now(),
      status: status || "submitted",
      priority: priority || false,
      anonymous: anonymous || false,
      image,
      createdBy: req.user,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      data: savedItem,
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating item",
    });
  }
};

// Get all approved items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({
      status: { $in: ["approved", "found"] },
    })
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching items",
    });
  }
};

// ... existing createItem and getItems functions ...

// Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching item",
    });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check if user owns the item or is admin
    if (item.createdBy.toString() !== req.user && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating item",
    });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check if user owns the item or is admin
    if (item.createdBy.toString() !== req.user && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting item",
    });
  }
};
