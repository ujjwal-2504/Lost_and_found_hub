import axios from "axios";
import { randomBytes } from "crypto";

// Configuration from environment variables with defaults
const config = {
  BASE_URL: process.env.BASE_URL || "http://localhost:5000/api",
  TEST_USER_EMAIL:
    process.env.TEST_USER_EMAIL ||
    `test-${Date.now()}-${randomBytes(4).toString("hex")}@example.com`,
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || "Test@1234",
  TEST_ADMIN_EMAIL: process.env.TEST_ADMIN_EMAIL || "",
  TEST_ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD || "",
  VERBOSE: process.env.VERBOSE === "true",
};

// Console output helpers
const log = (message, status = "info") => {
  const symbols = { success: "✓", error: "✗", info: "→", warn: "⚠" };
  const colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    info: "\x1b[34m",
    warn: "\x1b[33m",
    reset: "\x1b[0m",
  };
  console.log(
    `${colors[status] || colors.info}${
      symbols[status] || symbols.info
    } ${message}${colors.reset}`
  );
};

const verbose = (message) => {
  if (config.VERBOSE) {
    console.log(`   ${message}`);
  }
};

// Global variables
let userToken = null;
let adminToken = null;
let itemId = null;
let claimId = null;
let finderUserId = null;

// Axios instance
const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: 10000,
});

// Test counter
let testsRun = 0;
let testsPassed = 0;

const runTest = async (testName, testFunction) => {
  testsRun++;
  log(`${testsRun}. ${testName}...`, "info");

  try {
    const result = await testFunction();
    if (result !== false) {
      testsPassed++;
      log(`${testName} successful`, "success");
      return true;
    } else {
      log(`${testName} failed`, "error");
      return false;
    }
  } catch (error) {
    log(`${testName} failed: ${error.message}`, "error");
    if (config.VERBOSE) {
      console.error(error.response?.data || error);
    }
    return false;
  }
};

// Test Functions
const testServerConnectivity = async () => {
  const response = await axios.get(config.BASE_URL.replace("/api", ""), {
    timeout: 5000,
  });
  verbose(`Server responded: ${response.status}`);
  return response.status === 200;
};

const testUserRegistration = async () => {
  const payload = {
    name: "Test User",
    email: config.TEST_USER_EMAIL,
    phone: "123-456-7890",
    department: "Computer Science",
    year: "3rd Year",
    password: config.TEST_USER_PASSWORD,
  };

  verbose(`Registering user: ${config.TEST_USER_EMAIL}`);

  try {
    const response = await api.post("/auth/signup", payload);
    if (response.data.data && response.data.data.token) {
      userToken = response.data.data.token;
      finderUserId = response.data.data.user.id;
      verbose(`User registered with ID: ${finderUserId}`);
      return true;
    }
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("already exists")
    ) {
      verbose("User already exists, will proceed to login");
      return true;
    }
    throw error;
  }
};

const testUserLogin = async () => {
  const response = await api.post("/auth/login", {
    email: config.TEST_USER_EMAIL,
    password: config.TEST_USER_PASSWORD,
  });

  if (response.data.data && response.data.data.token) {
    userToken = response.data.data.token;
    finderUserId = response.data.data.user.id;
    verbose(`Login successful, token acquired`);
    return true;
  }
  return false;
};

const testGetProfile = async () => {
  const response = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  if (
    response.data.data &&
    response.data.data.user.email === config.TEST_USER_EMAIL
  ) {
    verbose(`Profile verified for: ${response.data.data.user.name}`);
    return true;
  }
  return false;
};

const testCreateFoundItem = async () => {
  const payload = {
    title: "Test Found Smartphone",
    description: "Black iPhone found in library during smoke test",
    category: "Electronics",
    location: "Main Library 2nd Floor",
    status: "submitted",
    image: "/uploads/test-placeholder.jpg",
  };

  const response = await api.post("/items", payload, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  if (response.data.data && response.data.data._id) {
    itemId = response.data.data._id;
    verbose(`Created item with ID: ${itemId}`);
    verbose(`Item status: ${response.data.data.status}`);
    return true;
  }
  return false;
};

const testCreateClaim = async () => {
  const payload = {
    itemId: itemId,
    identifiers:
      "Serial: ABC123456, Blue case with university sticker, cracked screen corner - smoke test claim",
  };

  const response = await api.post("/claims", payload, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  if (response.data.data && response.data.data._id) {
    claimId = response.data.data._id;
    verbose(`Created claim with ID: ${claimId}`);
    verbose(`Claim status: ${response.data.data.status}`);
    return true;
  }
  return false;
};

const testAdminLogin = async () => {
  if (!config.TEST_ADMIN_EMAIL || !config.TEST_ADMIN_PASSWORD) {
    log("Admin credentials not provided, skipping admin tests", "warn");
    return false;
  }

  const response = await api.post("/auth/login", {
    email: config.TEST_ADMIN_EMAIL,
    password: config.TEST_ADMIN_PASSWORD,
  });

  if (response.data.data && response.data.data.token) {
    adminToken = response.data.data.token;
    verbose(`Admin login successful`);
    return true;
  }
  return false;
};

const testAdminVerifyClaim = async () => {
  if (!adminToken) {
    return false;
  }

  // First, get user's points before verification
  const userBefore = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const pointsBefore = userBefore.data.data.user.points || 0;
  verbose(`User points before verification: ${pointsBefore}`);

  // Admin approves the claim
  const response = await api.put(
    `/admin/claims/${claimId}/verify`,
    {
      action: "approve",
    },
    {
      headers: { Authorization: `Bearer ${adminToken}` },
    }
  );

  if (response.data.success) {
    verbose(`Claim verification successful`);

    // Check if user's points increased
    const userAfter = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const pointsAfter = userAfter.data.data.user.points || 0;
    verbose(`User points after verification: ${pointsAfter}`);

    if (pointsAfter > pointsBefore) {
      verbose(`✓ Points awarded: +${pointsAfter - pointsBefore}`);
    }

    return true;
  }
  return false;
};

const testAdminLeaderboard = async () => {
  if (!adminToken) {
    return false;
  }

  const response = await api.get("/admin/leaderboard", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  if (response.data.success && Array.isArray(response.data.data)) {
    const leaderboard = response.data.data;
    verbose(`Leaderboard retrieved with ${leaderboard.length} users`);

    // Check if our test user appears in leaderboard with points
    const ourUser = leaderboard.find((user) => user._id === finderUserId);
    if (ourUser && ourUser.points > 0) {
      verbose(`✓ Test user found in leaderboard with ${ourUser.points} points`);
    }

    return true;
  }
  return false;
};

// Main smoke test execution
const runSmokeTest = async () => {
  console.log("🔥 Lost & Found Hub Backend - Enhanced Smoke Test");
  console.log(`📍 Base URL: ${config.BASE_URL}`);
  console.log(`👤 Test User: ${config.TEST_USER_EMAIL}`);
  console.log(
    `🔧 Admin Tests: ${config.TEST_ADMIN_EMAIL ? "Enabled" : "Disabled"}`
  );
  console.log("");

  // Define test sequence
  const tests = [
    ["Server Connectivity", testServerConnectivity],
    ["User Registration", testUserRegistration],
    ["User Login", testUserLogin],
    ["Get User Profile", testGetProfile],
    ["Create Found Item", testCreateFoundItem],
    ["Create Claim", testCreateClaim],
  ];

  // Add admin tests if credentials provided
  if (config.TEST_ADMIN_EMAIL && config.TEST_ADMIN_PASSWORD) {
    tests.push(
      ["Admin Login", testAdminLogin],
      ["Admin Verify Claim", testAdminVerifyClaim],
      ["Admin Leaderboard", testAdminLeaderboard]
    );
  }

  // Execute all tests
  for (const [testName, testFunction] of tests) {
    const success = await runTest(testName, testFunction);
    if (!success && ["Server Connectivity", "User Login"].includes(testName)) {
      log("Critical test failed, stopping execution", "error");
      process.exit(1);
    }
    console.log(""); // Empty line between tests
  }

  // Summary
  console.log("📊 Smoke Test Summary:");
  log(`Tests Run: ${testsRun}`, "info");
  log(`Passed: ${testsPassed}`, testsPassed === testsRun ? "success" : "warn");
  log(
    `Failed: ${testsRun - testsPassed}`,
    testsRun - testsPassed === 0 ? "success" : "error"
  );
  console.log("");

  if (testsPassed === testsRun) {
    log(
      "🎉 All smoke tests passed! Backend is ready for production.",
      "success"
    );
    process.exit(0);
  } else {
    log("❌ Some tests failed. Check server logs and configuration.", "error");
    process.exit(1);
  }
};

// Error handling
process.on("unhandledRejection", (error) => {
  log(`Unhandled error: ${error.message}`, "error");
  process.exit(1);
});

// Run the smoke test
runSmokeTest().catch((error) => {
  log(`Smoke test crashed: ${error.message}`, "error");
  process.exit(1);
});
