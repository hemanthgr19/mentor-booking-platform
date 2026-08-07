// React Router is used to move between pages
import { Routes, Route, Link } from "react-router-dom";

// Redux is used to read the logged-in user and handle logout
import { useDispatch, useSelector } from "react-redux";

// Import the logout action
import { logout } from "./features/auth/authSlice";

// Import application pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Mentors from "./pages/Mentors";
import MentorDetails from "./pages/MentorDetails";
import MentorDashboard from "./pages/MentorDashboard";
import CandidateBookings from "./pages/CandidateBookings";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";

// Main application styles
import "./App.scss";


function App() {
  // Redux dispatch function
  const dispatch = useDispatch();

  // Get the currently logged-in user from Redux
  const { user } = useSelector((state) => state.auth);


  // Clear login information when the user clicks Logout
  const handleLogout = () => {
    dispatch(logout());
  };


  return (
    <div className="app">

      {/* Main navigation bar */}
      <nav className="navbar">

        {/* Website name */}
        <Link to="/" className="brand">
          MentorConnect
        </Link>


        {/* Navigation links */}
        <div className="nav-links">

          {/* Everyone can browse mentors */}
          <Link to="/mentors">
            Find Mentors
          </Link>


          {/* Show Profile only when a user is logged in */}
          {user && (
            <Link to="/profile">
              Profile
            </Link>
          )}


          {/* Candidate-specific navigation */}
          {user?.role === "candidate" && (
            <Link to="/my-bookings">
              My Bookings
            </Link>
          )}


          {/* Mentor-specific navigation */}
          {user?.role === "mentor" && (
            <Link to="/mentor-dashboard">
              Mentor Dashboard
            </Link>
          )}


          {/* If a user is logged in, show their name and Logout */}
          {user ? (
            <>
              <span className="user-name">
                Hi, {user.name}
              </span>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Login and Register when nobody is logged in */}
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </nav>


      {/* Application routes */}
      <Routes>

        {/* Home page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Registration page */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Mentor listing page */}
        <Route
          path="/mentors"
          element={<Mentors />}
        />

        {/* Individual mentor profile */}
        <Route
          path="/mentors/:id"
          element={<MentorDetails />}
        />

        {/* Logged-in user profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Mentor dashboard */}
        <Route
          path="/mentor-dashboard"
          element={<MentorDashboard />}
        />

        {/* Candidate booking history */}
        <Route
          path="/my-bookings"
          element={<CandidateBookings />}
        />

        {/* Optional Chart.js statistics page */}
        <Route
          path="/stats"
          element={<Stats />}
        />

      </Routes>
    </div>
  );
}


// Export the main application component
export default App;