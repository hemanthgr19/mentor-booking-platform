// Import Express to create the mentor routes
const express = require("express");

// Import authentication middleware
// This is used for routes that should only work for logged-in users
const protect = require("../middleware/authMiddleware");

// Import mentor controller functions
const {
  getMentors,
  getMentorById,
  addSlot,
  removeSlot,
} = require("../controllers/mentorController");

// Create a new Express router
const router = express.Router();


// Get all mentors
// A skill can also be passed as a query to filter mentors
// GET /api/mentors
router.get("/", getMentors);


// Get one mentor using their ID
// GET /api/mentors/:id
router.get("/:id", getMentorById);


// Add a new availability slot
// The protect middleware checks that the user is logged in
// The controller then checks that the user is a mentor
// POST /api/mentors/slots
router.post("/slots", protect, addSlot);


// Remove an availability slot
// Booked slots cannot be removed
// DELETE /api/mentors/slots/:slotId
router.delete(
  "/slots/:slotId",
  protect,
  removeSlot
);


// Export the router so it can be used in server.js
module.exports = router;