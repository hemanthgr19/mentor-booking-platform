// useState keeps track of the registration form values and messages
import { useState } from "react";

// useDispatch sends actions to Redux
import { useDispatch } from "react-redux";

// useNavigate lets us move the user to another page after registration
import { useNavigate } from "react-router-dom";

// Axios is used to send the registration request to the backend
import axios from "axios";

// Import the Redux action used after successful registration
import { loginSuccess } from "../features/auth/authSlice";


function Register() {
  // Redux dispatch function
  const dispatch = useDispatch();

  // React Router navigation function
  const navigate = useNavigate();


  // Store the registration form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });


  // Store any registration error message
  const [message, setMessage] = useState("");


  // Update the correct form field while the user is typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Send the registration form to the backend
  const handleSubmit = async (e) => {
    // Prevent the browser from refreshing the page
    e.preventDefault();

    // Clear any previous message
    setMessage("");


    try {
      // Send the form details to the registration API
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );


      // Save the new user's token and details in Redux
      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.user,
        })
      );


      // Send mentors to the mentor page after registration
      if (response.data.user.role === "mentor") {
        navigate("/mentors");
      } else {
        // Send candidates to the home page
        navigate("/");
      }

    } catch (error) {
      // Show the message returned by the backend if registration fails
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          {/* Registration form card */}
          <div className="card shadow-sm p-4">
            <h2 className="mb-4">
              Create Account
            </h2>


            {/* Show an error message if registration fails */}
            {message && (
              <div className="alert alert-danger">
                {message}
              </div>
            )}


            {/* Registration form */}
            <form onSubmit={handleSubmit}>

              {/* Name field */}
              <div className="mb-3">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>


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


              {/* User chooses whether they are a candidate or mentor */}
              <div className="mb-3">
                <label className="form-label">
                  Register as
                </label>

                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="candidate">
                    Candidate
                  </option>

                  <option value="mentor">
                    Mentor
                  </option>
                </select>
              </div>


              {/* Submit the registration form */}
              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Register
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


// Export the page so App.jsx can use it
export default Register;