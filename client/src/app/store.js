// Import configureStore from Redux Toolkit
// This creates the main Redux store for the application
import { configureStore } from "@reduxjs/toolkit";

// Import the authentication reducer
// This handles logged-in user and token information
import authReducer from "../features/auth/authSlice";


// Create and export the Redux store
export const store = configureStore({
  reducer: {
    // Store authentication state under state.auth
    auth: authReducer,
  },
});