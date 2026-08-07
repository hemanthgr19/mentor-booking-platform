// Import Express to create the booking routes
const express = require("express");

// Import authentication middleware
// All booking routes require the user to be logged in
const protect = require("../middleware/authMiddleware");

// Import booking controller functions
const {
  createBooking,
  getMentorBookings,
  getCandidateBookings,
  approveBooking,
  declineBooking,
} = require("../controllers/bookingController");

// Create a new Express router
const router = express.Router();


// Create a new booking request
// Only a logged-in candidate can create a booking
// POST /api/bookings
router.post("/", protect, createBooking);


// Get all booking requests for the logged-in mentor
// GET /api/bookings/mentor
router.get("/mentor", protect, getMentorBookings);


// Get booking history for the logged-in candidate
// GET /api/bookings/my
router.get("/my", protect, getCandidateBookings);


// Approve a pending booking request
// Only the mentor who owns the booking can approve it
// PATCH /api/bookings/:bookingId/approve
router.patch(
  "/:bookingId/approve",
  protect,
  approveBooking
);


// Decline a pending booking request
// Only the mentor who owns the booking can decline it
// PATCH /api/bookings/:bookingId/decline
router.patch(
  "/:bookingId/decline",
  protect,
  declineBooking
);


// Export the router so it can be used in server.js
module.exports = router;