// React Router is used to move between pages
import { Routes, Route, Link } from "react-router-dom";

// Import all pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Mentors from "./pages/Mentors";
import MentorDetails from "./pages/MentorDetails";
import MentorDashboard from "./pages/MentorDashboard";
import CandidateBookings from "./pages/CandidateBookings";
import Stats from "./pages/Stats";

// Redux is used to check the logged-in user
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authSlice";

// Main CSS file
import "./App.css";

function App() {
  // Get dispatch so we can log the user out
  const dispatch = useDispatch();

  // Get logged-in user details from Redux
  const { user } = useSelector((state) => state.auth);

  // Logout button action
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app">

      {/* Main navigation bar */}
      <nav className="navbar">

        {/* Website name - clicking this takes user to home page */}
        <Link to="/" className="brand">
          MentorConnect
        </Link>

        {/* Navigation links */}
        <div className="nav-links">

          {/* Everyone can view mentors */}
          <Link to="/mentors">
            Find Mentors
          </Link>

          {/* Candidate can see their bookings */}
          {user?.role === "candidate" && (
            <Link to="/my-bookings">
              My Bookings
            </Link>
          )}

          {/* Mentor can access mentor dashboard */}
          {user?.role === "mentor" && (
            <Link to="/mentor-dashboard">
              Mentor Dashboard
            </Link>
          )}

          {/* Show this section when user is logged in */}
          {user ? (
            <>
              {/* Display logged-in user's name */}
              <span className="user-name">
                Hi, {user.name}
              </span>

              {/* Logout button */}
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
              {/* Show Login and Register only when nobody is logged in */}
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}

        </div>
      </nav>

      {/* Application pages */}
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

        {/* Individual mentor details page */}
        <Route
          path="/mentors/:id"
          element={<MentorDetails />}
        />

        {/* Dashboard used by mentors */}
        <Route
          path="/mentor-dashboard"
          element={<MentorDashboard />}
        />

        {/* Candidate booking history */}
        <Route
          path="/my-bookings"
          element={<CandidateBookings />}
        />

        {/* Statistics page */}
        <Route
          path="/stats"
          element={<Stats />}
        />

      </Routes>
    </div>
  );
}

export default App;