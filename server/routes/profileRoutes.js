// Import Express to create profile routes
const express = require("express");

// Create a new router
const router = express.Router();

// Import the authentication middleware
// This makes sure only logged-in users can access these routes
const protect = require("../middleware/authMiddleware");

// Import profile controller functions
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");


// Get the logged-in user's profile
// GET /api/profile
router.get("/", protect, getProfile);


// Update the logged-in user's profile
// PUT /api/profile
router.put("/", protect, updateProfile);


// Export the router so it can be used in server.js
module.exports = router;