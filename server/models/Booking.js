// Import Mongoose to create the booking schema
const mongoose = require("mongoose");


// Schema used to store mentoring session bookings
const bookingSchema = new mongoose.Schema(
  {
    // Candidate who requested the mentoring session
    // This links the booking to a user in the User collection
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Mentor selected by the candidate
    // This also links to a user in the User collection
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ID of the availability slot selected by the candidate
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Stores the actual date and time of the selected session
    slotTime: {
      type: Date,
      required: true,
    },

    // Booking starts as pending until the mentor takes action
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },

    // Meeting link is added after the booking is approved
    meetingLink: {
      type: String,
      default: "",
    },
  },

  // Automatically stores createdAt and updatedAt
  {
    timestamps: true,
  }
);


// Create and export the Booking model
module.exports = mongoose.model("Booking", bookingSchema);