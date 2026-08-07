// React hooks used to load mentor data and manage page messages
import { useEffect, useState } from "react";

// useParams reads the mentor ID from the URL
// useNavigate lets us move the user to the login page if needed
import { useParams, useNavigate } from "react-router-dom";

// useSelector reads the logged-in user and token from Redux
import { useSelector } from "react-redux";

// Axios is used to call the backend API
import axios from "axios";


function MentorDetails() {
  // Read the mentor ID from /mentors/:id
  const { id } = useParams();

  // Used to redirect users when needed
  const navigate = useNavigate();


  // Get the logged-in user and JWT token from Redux
  const { token, user } = useSelector((state) => state.auth);


  // Store the selected mentor details
  const [mentor, setMentor] = useState(null);

  // Track whether mentor data is still loading
  const [loading, setLoading] = useState(true);

  // Store booking success or error messages
  const [message, setMessage] = useState("");


  // Refresh mentor data
  // This is used after a booking is created
  const fetchMentor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mentors/${id}`
      );

      // Save mentor details in state
      setMentor(response.data.mentor);

    } catch (error) {
      // Show the error in the browser console
      console.error("Error loading mentor:", error);

    } finally {
      // Stop the loading state
      setLoading(false);
    }
  };


  // Load mentor details when the page first opens
  useEffect(() => {
  
    // Request mentor information directly inside the effect
    axios
      .get(
        `http://localhost:5000/api/mentors/${id}`
      )
      .then((response) => {
        setMentor(response.data.mentor);
      })
      .catch((error) => {
        console.error("Error loading mentor:", error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);


  // Create a booking for the selected time slot
  const handleBooking = async (slotId) => {
    // If the user is not logged in, send them to the login page
    if (!token) {
      navigate("/login");
      return;
    }


    // Only candidate accounts are allowed to book sessions
    if (user?.role !== "candidate") {
      setMessage("Only candidates can book mentor sessions.");
      return;
    }


    try {
      // Send the selected mentor and slot to the booking API
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          mentorId: mentor._id,
          slotId,
        },
        {
          // Send the JWT token so the backend knows who is booking
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // Show the response message
      setMessage(response.data.message);


      // Refresh mentor data after the booking
      fetchMentor();

    } catch (error) {
      // Show the backend error if the booking fails
      setMessage(
        error.response?.data?.message || "Booking failed"
      );
    }
  };


  // Show loading text while mentor data is being requested
  if (loading) {
    return (
      <div className="container py-5">
        Loading mentor...
      </div>
    );
  }


  // Show this if the mentor cannot be found
  if (!mentor) {
    return (
      <div className="container py-5">
        Mentor not found.
      </div>
    );
  }


  // Only show slots that are still available
  const openSlots =
    mentor.availableSlots?.filter(
      (slot) => !slot.isBooked
    ) || [];


  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">

          {/* Mentor name */}
          <h1>{mentor.name}</h1>


          {/* Mentor email */}
          <p className="text-muted">
            {mentor.email}
          </p>


          {/* Mentor bio */}
          <p>
            {mentor.bio || "No bio added yet."}
          </p>


          {/* Mentor expertise */}
          <div className="mb-4">
            {mentor.expertise?.map((item) => (
              <span
                key={item}
                className="badge bg-primary me-2 mb-2"
              >
                {item}
              </span>
            ))}
          </div>


          {/* Show booking success or error messages */}
          {message && (
            <div className="alert alert-info">
              {message}
            </div>
          )}


          {/* Mentor availability */}
          <h3>Available Slots</h3>


          {openSlots.length === 0 ? (
            <div className="alert alert-info">
              No available slots at the moment.
            </div>

          ) : (
            <div className="list-group">
              {openSlots.map((slot) => (
                <div
                  key={slot._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {/* Show the slot in the user's local date and time */}
                  <span>
                    {new Date(
                      slot.startTime
                    ).toLocaleString()}
                  </span>


                  {/* Book the selected slot */}
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      handleBooking(slot._id)
                    }
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


// Export the page so App.jsx can use it
export default MentorDetails;