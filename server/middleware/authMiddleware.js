// Import JWT so we can verify the token sent by the frontend
const jwt = require("jsonwebtoken");

// Import the User model to find the logged-in user
const User = require("../models/User");


// Middleware used to protect private API routes
const protect = async (req, res, next) => {
  try {
    // Variable used to store the JWT token
    let token;


    // Check whether the request contains a Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      // Extract only the token from "Bearer TOKEN"
      token = req.headers.authorization.split(" ")[1];
    }


    // Stop the request if no token was provided
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }


    // Verify the token using the secret stored in the .env file
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Find the user connected to this token
    // Password is excluded because it is not needed here
    const user = await User.findById(decoded.id).select("-password");


    // Stop the request if the user no longer exists
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }


    // Attach the logged-in user to the request
    // Controllers can now access the user using req.user
    req.user = user;


    // Continue to the requested controller
    next();

  } catch (error) {
    // This normally happens when the token is invalid or expired
    console.error("Auth error:", error.message);


    // Return an unauthorized response
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};


// Export the middleware so protected routes can use it
module.exports = protect;