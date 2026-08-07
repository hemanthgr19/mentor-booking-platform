// Import Express to create the backend server
const express = require("express");

// CORS allows the React frontend to communicate with this API
const cors = require("cors");

// Loads environment variables from the .env file
const dotenv = require("dotenv");

// Import the MongoDB connection function
const connectDB = require("./config/db");

// Import the application routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


// Load environment variables before using them
dotenv.config();


// Connect the application to MongoDB
connectDB();


// Create the Express application
const app = express();


// Allow requests from the frontend
app.use(cors());


// Allow the server to read JSON request bodies
app.use(express.json());


// Authentication routes such as register and login
app.use("/api/auth", authRoutes);


// User profile routes
app.use("/api/profile", profileRoutes);


// Mentor listing, profile and availability routes
app.use("/api/mentors", mentorRoutes);


// Booking, approval and decline routes
app.use("/api/bookings", bookingRoutes);


// Simple route to check whether the API is running
app.get("/", (req, res) => {
  res.json({
    message: "Mentor Booking API is running",
  });
});


// Use the port from .env, or port 5000 if one is not provided
const PORT = process.env.PORT || 5000;


// Start the backend server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});