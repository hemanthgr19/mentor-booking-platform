// Import Express to create authentication routes
const express = require("express");

// Import the register and login functions from the auth controller
const {
  register,
  login,
} = require("../controllers/authController");


// Create a new Express router
const router = express.Router();


// Register a new candidate or mentor
// POST /api/auth/register
router.post("/register", register);


// Login an existing user
// POST /api/auth/login
router.post("/login", login);


// Export the router so it can be used in server.js
module.exports = router;