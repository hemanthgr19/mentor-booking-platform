// useState keeps track of the form values and messages
import { useState } from "react";

// useDispatch sends actions to Redux
import { useDispatch } from "react-redux";

// useNavigate lets us move to another page after login
import { useNavigate } from "react-router-dom";

// Axios is used to call the backend API
import axios from "axios";

// Import the Redux action used after a successful login
import { loginSuccess } from "../features/auth/authSlice";


function Login() {
  // Redux dispatch function
  const dispatch = useDispatch();

  // React Router navigation function
  const navigate = useNavigate();


  // Store the email and password entered by the user
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // Store success or error messages
  const [message, setMessage] = useState("");


  // Update the correct form field while the user is typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Send the login request to the backend
  const handleSubmit = async (e) => {
    // Prevent the browser from refreshing the page
    e.preventDefault();

    // Clear any previous message
    setMessage("");


    try {
      // Send email and password to the login API
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );


      // Save the JWT token and user details in Redux
      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.user,
        })
      );


      // Show a successful login message
      setMessage("Login successful");


      // Send mentors to their mentor page
      if (response.data.user.role === "mentor") {
        navigate("/mentors");
      } else {
        // Send candidates back to the home page
        navigate("/");
      }

    } catch (error) {
      // Show the message returned by the backend if login fails
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          {/* Login form card */}
          <div className="card shadow-sm p-4">
            <h2 className="mb-4">
              Login
            </h2>


            {/* Show success or error messages */}
            {message && (
              <div className="alert alert-info">
                {message}
              </div>
            )}


            {/* Login form */}
            <form onSubmit={handleSubmit}>

              {/* Email field */}
              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* Password field */}
              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* Submit the login form */}
              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


// Export the page so App.jsx can use it
export default Login;