// Import createSlice from Redux Toolkit
// It helps us manage authentication state and actions in one place
import { createSlice } from "@reduxjs/toolkit";


// Check whether login information already exists in the browser
const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");


// Set the starting authentication state
// This keeps the user logged in even after refreshing the page
const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
};


// Create the authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Store user information after a successful login or registration
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;


      // Save login details in localStorage
      // This prevents login state from disappearing after page refresh
      localStorage.setItem(
        "token",
        action.payload.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );
    },


    // Clear authentication information when the user logs out
    logout: (state) => {
      state.token = null;
      state.user = null;


      // Remove saved login information from the browser
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});


// Export the actions so components can login and logout users
export const {
  loginSuccess,
  logout,
} = authSlice.actions;


// Export the reducer so it can be added to the Redux store
export default authSlice.reducer;