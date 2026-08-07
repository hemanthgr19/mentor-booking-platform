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
import Profile from "./pages/Profile";

// Redux is used to read the logged-in user and handle logout
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authSlice";

// Main application styles
import "./App.scss";

function App() {
  // Redux dispatch function
  const dispatch = useDispatch();

  // Get the logged-in user from Redux
  const { user } = useSelector((state) => state.auth);

  // Logout action
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

          {/* Show Profile only when the user is logged in */}
          {user && (
            <Link to="/profile">
              Profile
            </Link>
          )}

          {/* Candidate-specific page */}
          {user?.role === "candidate" && (
            <Link to="/my-bookings">
              My Bookings
            </Link>
          )}

          {/* Mentor-specific page */}
          {user?.role === "mentor" && (
            <Link to="/mentor-dashboard">
              Mentor Dashboard
            </Link>
          )}

          {/* Logged-in navigation */}
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
              {/* Login and Register are only shown when logged out */}
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

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/mentors"
          element={<Mentors />}
        />

        <Route
          path="/mentors/:id"
          element={<MentorDetails />}
        />

        <Route
          path="/mentor-dashboard"
          element={<MentorDashboard />}
        />

        <Route
          path="/my-bookings"
          element={<CandidateBookings />}
        />

        <Route
          path="/stats"
          element={<Stats />}
        />

      </Routes>
    </div>
  );
}

export default App;