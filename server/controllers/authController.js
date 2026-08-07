// bcrypt is used to hash and compare passwords
const bcrypt = require("bcryptjs");

// JWT is used to create login tokens
const jwt = require("jsonwebtoken");

// Import the User model
const User = require("../models/User");


// Create a JWT token for the logged-in or registered user
const generateToken = (user) => {
  return jwt.sign(
    {
      // Store the user ID inside the token
      id: user._id,

      // Store the user role so we know if they are candidate or mentor
      role: user.role,
    },

    // Secret key is stored in the .env file
    process.env.JWT_SECRET,

    {
      // Token will stay valid for 7 days
      expiresIn: "7d",
    }
  );
};


// Register a new candidate or mentor
const register = async (req, res) => {
  try {
    // Read registration details from the request body
    const { name, email, password, role } = req.body;


    // Make sure all required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }


    // Only candidate and mentor roles are allowed
    if (!["candidate", "mentor"].includes(role)) {
      return res.status(400).json({
        message: "Role must be candidate or mentor",
      });
    }


    // Check whether this email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    // Hash the password before saving it to MongoDB
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });


    // Create a JWT token after registration
    const token = generateToken(user);


    // Return the new user details and token
    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    // Log unexpected registration errors in the terminal
    console.error("Register error:", error);


    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Login an existing user
const login = async (req, res) => {
  try {
    // Read login details from the request body
    const { email, password } = req.body;


    // Make sure email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }


    // Find the user by email
    const user = await User.findOne({ email });


    // Return the same message for unknown users and wrong passwords
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // Compare the entered password with the hashed password in MongoDB
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );


    // Stop login if the password is incorrect
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // Create a new JWT token after successful login
    const token = generateToken(user);


    // Return the logged-in user details and token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    // Log unexpected login errors
    console.error("Login error:", error);


    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Export the controller functions for the auth routes
module.exports = {
  register,
  login,
};