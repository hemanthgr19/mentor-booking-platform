// Import Mongoose to create the user and slot schemas
const mongoose = require("mongoose");


// Schema used for each mentor availability slot
const slotSchema = new mongoose.Schema({
  // Date and time when the mentor is available
  startTime: {
    type: Date,
    required: true,
  },

  // Shows whether this slot has already been booked
  isBooked: {
    type: Boolean,
    default: false,
  },
});


// Main schema used for both candidates and mentors
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email is used for registration and login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Stores the hashed password
    password: {
      type: String,
      required: true,
    },

    // Defines whether the account belongs to a candidate or mentor
    role: {
      type: String,
      enum: ["candidate", "mentor"],
      required: true,
    },

    // Short description about the user
    bio: {
      type: String,
      default: "",
    },

    // Skills can be added to the user's profile
    skills: {
      type: [String],
      default: [],
    },

    // Areas of expertise mainly used for mentor profiles
    expertise: {
      type: [String],
      default: [],
    },

    // Stores the time slots created by a mentor
    availableSlots: {
      type: [slotSchema],
      default: [],
    },
  },

  // Automatically adds createdAt and updatedAt fields
  {
    timestamps: true,
  }
);


// Create and export the User model
module.exports = mongoose.model("User", userSchema);