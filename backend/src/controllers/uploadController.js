// Handle file upload
export const uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Return success response with file info
    res.status(201).json({
      success: true,
      fileUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during file upload",
    });
  }
};
