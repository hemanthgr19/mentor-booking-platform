// React hooks used to load bookings and manage messages
import { useEffect, useState } from "react";

// useSelector reads the logged-in candidate and JWT token from Redux
import { useSelector } from "react-redux";

// Axios is used to call the backend API
import axios from "axios";


function CandidateBookings() {
  // Get the logged-in user and token from Redux
  const { token, user } = useSelector((state) => state.auth);


  // Store the candidate's booking history
  const [bookings, setBookings] = useState([]);

  // Store any error message
  const [message, setMessage] = useState("");


  // Load the candidate's bookings when the page opens
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Request bookings created by the logged-in candidate
        const response = await axios.get(
          "http://localhost:5000/api/bookings/my",
          {
            // Send the JWT token with the request
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Save the returned booking list
        setBookings(response.data.bookings);

      } catch (error) {
        // Show an error message if bookings cannot be loaded
        setMessage(
          error.response?.data?.message || "Could not load bookings"
        );
      }
    };


    // Only load this data for logged-in candidate accounts
    if (token && user?.role === "candidate") {
      fetchBookings();
    }

  }, [token, user]);


  // Prevent mentor accounts from using the candidate bookings page
  if (user?.role !== "candidate") {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Candidate access only.
        </div>
      </div>
    );
  }


  return (
    <div className="container py-5">

      {/* Page heading */}
      <h1 className="mb-4">
        My Bookings
      </h1>


      {/* Show an error message if the API request fails */}
      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}


      {/* Show a message when the candidate has no bookings */}
      {bookings.length === 0 ? (
        <div className="alert alert-secondary">
          You do not have any bookings yet.
        </div>

      ) : (
        // Display each booking in a card
        <div className="row g-4">

          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="col-md-6"
            >
              <div className="card shadow-sm">
                <div className="card-body">

                  {/* Mentor name */}
                  <h5>
                    {booking.mentor?.name || "Mentor"}
                  </h5>


                  {/* Session date and time */}
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      booking.slotTime
                    ).toLocaleString()}
                  </p>


                  {/* Current booking status */}
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-capitalize">
                      {booking.status}
                    </span>
                  </p>


                  {/* Show the meeting button only after approval */}
                  {booking.status === "approved" &&
                    booking.meetingLink && (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success"
                      >
                        Join Meeting
                      </a>
                    )}

                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}


// Export the page so App.jsx can use it
export default CandidateBookings;