import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import connectDB from "../src/config/db.js";

// Load environment variables
dotenv.config();

// Admin credentials from environment variables with defaults
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@college.edu";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

async function createAdmin() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database...");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("Admin user already exists with email:", ADMIN_EMAIL);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash the admin password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // Create new admin user
    const adminUser = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      points: 0,
      badges: [],
    });

    // Save admin user to database
    const savedAdmin = await adminUser.save();

    console.log("✓ Admin user created successfully!");
    console.log("Email:", savedAdmin.email);
    console.log("ID:", savedAdmin._id);
    console.log("Role:", savedAdmin.role);

    // Close database connection and exit
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the admin creation script
createAdmin();
