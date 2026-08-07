// Import the User model
const User = require("../models/User");


// Return all mentors, with optional filtering by expertise
const getMentors = async (req, res) => {
  try {
    // Read the skill filter from the query string
    const { skill } = req.query;


    // Start by looking only for users with the mentor role
    const filter = {
      role: "mentor",
    };


    // If a skill is provided, filter mentors by expertise
    if (skill) {
      filter.expertise = {
        $regex: skill,
        $options: "i",
      };
    }


    // Find matching mentors and exclude their passwords
    const mentors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });


    // Return the mentor list
    return res.status(200).json({
      count: mentors.length,
      mentors,
    });

  } catch (error) {
    // Log unexpected errors while loading mentors
    console.error("Get mentors error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Add a new availability slot for the logged-in mentor
const addSlot = async (req, res) => {
  try {
    // Read the selected date and time from the request body
    const { startTime } = req.body;


    // Only mentor accounts are allowed to create availability slots
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can add slots",
      });
    }


    // Make sure a time was provided
    if (!startTime) {
      return res.status(400).json({
        message: "Start time is required",
      });
    }


    // Find the logged-in mentor
    const mentor = await User.findById(req.user._id);


    // Add the new slot as available
    mentor.availableSlots.push({
      startTime,
      isBooked: false,
    });


    // Save the updated mentor profile
    await mentor.save();


    // Return the updated slot list
    return res.status(201).json({
      message: "Slot added successfully",
      availableSlots: mentor.availableSlots,
    });

  } catch (error) {
    // Log unexpected errors while adding a slot
    console.error("Add slot error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Remove an existing mentor availability slot
const removeSlot = async (req, res) => {
  try {
    // Only mentors can remove their own availability slots
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can remove slots",
      });
    }


    // Find the logged-in mentor
    const mentor = await User.findById(req.user._id);


    // Find the selected slot inside the mentor's availableSlots array
    const slot = mentor.availableSlots.id(req.params.slotId);


    // Return an error if the slot does not exist
    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }


    // Do not allow removal of a slot that has already been booked
    if (slot.isBooked) {
      return res.status(400).json({
        message: "Booked slots cannot be removed",
      });
    }


    // Remove the slot from the mentor's availability
    mentor.availableSlots.pull(req.params.slotId);


    // Save the updated mentor profile
    await mentor.save();


    // Return the remaining availability slots
    return res.status(200).json({
      message: "Slot removed successfully",
      availableSlots: mentor.availableSlots,
    });

  } catch (error) {
    // Log unexpected errors while removing a slot
    console.error("Remove slot error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Return one mentor using the mentor ID from the URL
const getMentorById = async (req, res) => {
  try {
    // Find the mentor and make sure the selected user has the mentor role
    const mentor = await User.findOne({
      _id: req.params.id,
      role: "mentor",
    }).select("-password");


    // Return an error if no matching mentor is found
    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }


    // Return the mentor profile
    return res.status(200).json({
      mentor,
    });

  } catch (error) {
    // Log unexpected errors while loading a mentor
    console.error("Get mentor error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Export the mentor controller functions for the routes
module.exports = {
  getMentors,
  getMentorById,
  addSlot,
  removeSlot,
};