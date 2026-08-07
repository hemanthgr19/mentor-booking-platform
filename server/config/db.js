// Import Mongoose so the application can connect to MongoDB
const mongoose = require("mongoose");


// Create the database connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the .env file
    const connection = await mongoose.connect(process.env.MONGO_URI);

    // Show the connected MongoDB host in the terminal
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    // Display the error if MongoDB connection fails
    console.error(`MongoDB connection error: ${error.message}`);

    // Stop the application if the database connection cannot be established
    process.exit(1);
  }
};


// Export the function so it can be used in server.js
module.exports = connectDB;