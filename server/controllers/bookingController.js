// Import the Booking model
const Booking = require("../models/Booking");

// Import the User model
const User = require("../models/User");

// Nodemailer is used to generate preview links for test emails
const nodemailer = require("nodemailer");

// Import the test email transporter
const createTransporter = require("../config/mailer");


// Create a new booking request
const createBooking = async (req, res) => {
  try {
    // Only candidates are allowed to create bookings
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can create bookings",
      });
    }


    // Read the selected mentor and slot from the request body
    const { mentorId, slotId } = req.body;


    // Both values are required to create a booking
    if (!mentorId || !slotId) {
      return res.status(400).json({
        message: "Mentor and slot are required",
      });
    }


    // Find the selected mentor and confirm the user has mentor role
    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor",
    });


    // Stop if the mentor does not exist
    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }


    // Find the selected availability slot inside the mentor profile
    const slot = mentor.availableSlots.id(slotId);


    // Stop if the slot does not exist
    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }


    // Do not allow a booking if the slot is already booked
    if (slot.isBooked) {
      return res.status(400).json({
        message: "This slot is already booked",
      });
    }


    // Check whether the slot already has a pending booking
    const existingBooking = await Booking.findOne({
      mentor: mentorId,
      slotId,
      status: "pending",
    });


    // Prevent duplicate pending bookings for the same slot
    if (existingBooking) {
      return res.status(400).json({
        message: "This slot already has a pending booking",
      });
    }


    // Create the booking with pending status
    const booking = await Booking.create({
      candidate: req.user._id,
      mentor: mentorId,
      slotId: slot._id,
      slotTime: slot.startTime,
      status: "pending",
    });


    // Return the newly created booking
    return res.status(201).json({
      message: "Booking request created successfully",
      booking,
    });

  } catch (error) {
    // Log unexpected booking errors
    console.error("Create booking error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Return all bookings assigned to the logged-in mentor
const getMentorBookings = async (req, res) => {
  try {
    // Only mentors can view mentor booking requests
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can view mentor bookings",
      });
    }


    // Find bookings that belong to the logged-in mentor
    // Candidate name and email are included for the dashboard
    const bookings = await Booking.find({
      mentor: req.user._id,
    })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });


    // Return the mentor booking list
    return res.status(200).json({
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    // Log unexpected errors while loading mentor bookings
    console.error("Get mentor bookings error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Approve a pending booking
const approveBooking = async (req, res) => {
  try {
    // Only mentors are allowed to approve bookings
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can approve bookings",
      });
    }


    // Find the booking using the booking ID from the URL
    const booking = await Booking.findById(req.params.bookingId);


    // Stop if the booking does not exist
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }


    // Make sure the logged-in mentor owns this booking
    if (booking.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot approve this booking",
      });
    }


    // Only pending bookings can be approved
    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Booking is already processed",
      });
    }


    // Load the mentor profile so the selected slot can be updated
    const mentor = await User.findById(req.user._id);


    // Find the slot connected to this booking
    const slot = mentor.availableSlots.id(booking.slotId);


    // Stop if the slot cannot be found
    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }


    // Mark the slot as booked
    slot.isBooked = true;


    // Approve the booking and add a placeholder meeting link
    booking.status = "approved";
    booking.meetingLink = "https://meet.google.com/mentor-demo";


    // Save both the mentor slot and the booking
    await mentor.save();
    await booking.save();


    // Load the candidate so their name and email can be used
    const candidate = await User.findById(booking.candidate);


    // Create a temporary Ethereal email transporter
    const transporter = await createTransporter();


    // Send confirmation email to the candidate
    const candidateEmail = await transporter.sendMail({
      from: '"Mentor Booking" <no-reply@mentorbooking.test>',
      to: candidate.email,
      subject: "Mentoring session approved",
      text: `Hi ${candidate.name},

Your mentoring session with ${mentor.name} has been approved.

Date: ${booking.slotTime}

Meeting link:
${booking.meetingLink}

Thank you.`,
    });


    // Send confirmation email to the mentor
    const mentorEmail = await transporter.sendMail({
      from: '"Mentor Booking" <no-reply@mentorbooking.test>',
      to: mentor.email,
      subject: "Mentoring session confirmed",
      text: `Hi ${mentor.name},

You approved a mentoring session with ${candidate.name}.

Date: ${booking.slotTime}

Meeting link:
${booking.meetingLink}`,
    });


    // Print preview links in the terminal so the test emails can be opened
    console.log(
      "Candidate email preview:",
      nodemailer.getTestMessageUrl(candidateEmail)
    );

    console.log(
      "Mentor email preview:",
      nodemailer.getTestMessageUrl(mentorEmail)
    );


    // Return the approved booking
    return res.status(200).json({
      message: "Booking approved successfully",
      booking,
    });

  } catch (error) {
    // Log unexpected approval errors
    console.error("Approve booking error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Decline a pending booking
const declineBooking = async (req, res) => {
  try {
    // Only mentors can decline bookings
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can decline bookings",
      });
    }


    // Find the booking using the ID from the URL
    const booking = await Booking.findById(req.params.bookingId);


    // Stop if the booking cannot be found
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }


    // Make sure this booking belongs to the logged-in mentor
    if (booking.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot decline this booking",
      });
    }


    // Only pending bookings can be declined
    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Booking is already processed",
      });
    }


    // Update the booking status
    booking.status = "declined";


    // Save the updated booking
    await booking.save();


    // Return the declined booking
    return res.status(200).json({
      message: "Booking declined successfully",
      booking,
    });

  } catch (error) {
    // Log unexpected decline errors
    console.error("Decline booking error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Return all bookings created by the logged-in candidate
const getCandidateBookings = async (req, res) => {
  try {
    // Only candidates can view candidate booking history
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can view their bookings",
      });
    }


    // Find bookings created by this candidate
    // Mentor details are included for the candidate dashboard
    const bookings = await Booking.find({
      candidate: req.user._id,
    })
      .populate("mentor", "name email expertise")
      .sort({ createdAt: -1 });


    // Return candidate booking history
    return res.status(200).json({
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    // Log unexpected errors while loading candidate bookings
    console.error("Get candidate bookings error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Export all booking controller functions for the booking routes
module.exports = {
  createBooking,
  getMentorBookings,
  getCandidateBookings,
  approveBooking,
  declineBooking,
};