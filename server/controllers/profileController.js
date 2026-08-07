// Import the User model
const User = require("../models/User");


// Return the profile of the currently logged-in user
const getProfile = async (req, res) => {
  try {
    // req.user is added by the auth middleware after JWT verification
    return res.status(200).json({
      user: req.user,
    });

  } catch (error) {
    // Log unexpected errors while loading the profile
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Update candidate or mentor profile information
const updateProfile = async (req, res) => {
  try {
    // Read the fields that can be updated from the request body
    const { name, bio, skills, expertise } = req.body;


    // Find the logged-in user in MongoDB
    const user = await User.findById(req.user._id);


    // Return an error if the user cannot be found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // Update the name only when a new value is provided
    if (name !== undefined) {
      user.name = name;
    }


    // Update the bio only when a new value is provided
    if (bio !== undefined) {
      user.bio = bio;
    }


    // Candidates can update their skills
    if (user.role === "candidate" && skills !== undefined) {
      user.skills = skills;
    }


    // Mentors can update their expertise
    if (user.role === "mentor" && expertise !== undefined) {
      user.expertise = expertise;
    }


    // Save the updated profile to MongoDB
    await user.save();


    // Return the updated profile details
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        expertise: user.expertise,
      },
    });

  } catch (error) {
    // Log unexpected errors while updating the profile
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Export the profile controller functions
module.exports = {
  getProfile,
  updateProfile,
};