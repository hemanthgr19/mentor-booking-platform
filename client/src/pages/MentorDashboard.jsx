// React hooks used to manage bookings, mentor slots and messages
import { useEffect, useState } from "react";

// useSelector reads the logged-in mentor and JWT token from Redux
import { useSelector } from "react-redux";

// Axios is used to call the backend API
import axios from "axios";


function MentorDashboard() {
  // Get the logged-in mentor and token from Redux
  const { token, user } = useSelector((state) => state.auth);


  // Store booking requests for this mentor
  const [bookings, setBookings] = useState([]);

  // Store the mentor's available slots
  const [slots, setSlots] = useState([]);

  // Store the new date and time entered by the mentor
  const [newSlotTime, setNewSlotTime] = useState("");

  // Store success or error messages
  const [message, setMessage] = useState("");


  // Refresh the mentor booking list
  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/mentor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data.bookings);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not load bookings"
      );
    }
  };


  // Load the logged-in mentor profile
  // We use this to show the mentor's availability slots
  const fetchMentorProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots(
        response.data.user.availableSlots || []
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not load mentor profile"
      );
    }
  };


  // Load mentor bookings when the dashboard opens
  useEffect(() => {
    if (!token || user?.role !== "mentor") {
      return;
    }

    axios
      .get(
        "http://localhost:5000/api/bookings/mentor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message ||
            "Could not load bookings"
        );
      });

  }, [token, user?.role]);


  // Load mentor availability when the dashboard opens
  useEffect(() => {
    if (!token || user?.role !== "mentor") {
      return;
    }

    axios
      .get(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSlots(
          response.data.user.availableSlots || []
        );
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message ||
            "Could not load mentor profile"
        );
      });

  }, [token, user?.role]);


  // Add a new availability slot
  const handleAddSlot = async (e) => {
    e.preventDefault();

    // Make sure the mentor selected a date and time
    if (!newSlotTime) {
      setMessage("Please select a date and time.");
      return;
    }

    try {
      // Convert the local date/time into ISO format for the backend
      const startTime = new Date(
        newSlotTime
      ).toISOString();

      const response = await axios.post(
        "http://localhost:5000/api/mentors/slots",
        {
          startTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      setMessage(response.data.message);

      // Clear the input after adding the slot
      setNewSlotTime("");

      // Reload mentor profile so the new slot appears
      fetchMentorProfile();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not add slot"
      );
    }
  };


  // Remove an unbooked availability slot
  const handleRemoveSlot = async (slotId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/mentors/slots/${slotId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show the backend response
      setMessage(response.data.message);

      // Refresh the slot list
      fetchMentorProfile();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not remove slot"
      );
    }
  };


  // Approve or decline a booking request
  const handleAction = async (bookingId, action) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/bookings/${bookingId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      setMessage(response.data.message);

      // Reload bookings after the action
      fetchBookings();

      // Refresh slots because approval marks a slot as booked
      fetchMentorProfile();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Action failed"
      );
    }
  };


  // Prevent candidates from using the mentor dashboard
  if (user?.role !== "mentor") {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Mentor access only.
        </div>
      </div>
    );
  }


  return (
    <div className="container py-5">

      {/* Dashboard heading */}
      <h1 className="mb-4">
        Mentor Dashboard
      </h1>


      {/* Show success or error messages */}
      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}


      {/* Mentor availability section */}
      <section className="mb-5">
        <h2 className="mb-3">
          Manage Availability
        </h2>


        {/* Form used to create a new mentor slot */}
        <form
          className="row g-2 mb-4"
          onSubmit={handleAddSlot}
        >
          <div className="col-md-8">
            <input
              type="datetime-local"
              className="form-control"
              value={newSlotTime}
              onChange={(e) =>
                setNewSlotTime(e.target.value)
              }
              required
            />
          </div>

          <div className="col-md-4">
            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Add Slot
            </button>
          </div>
        </form>


        {/* Show mentor availability slots */}
        {slots.length === 0 ? (
          <div className="alert alert-secondary">
            You have not added any availability yet.
          </div>
        ) : (
          <div className="list-group">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {/* Display the slot in local time */}
                  <strong>
                    {new Date(
                      slot.startTime
                    ).toLocaleString()}
                  </strong>

                  <div className="small text-muted">
                    {slot.isBooked
                      ? "Booked"
                      : "Available"}
                  </div>
                </div>


                {/* Only allow unbooked slots to be removed */}
                {!slot.isBooked && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      handleRemoveSlot(slot._id)
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Booking request section */}
      <section>
        <h2 className="mb-3">
          Booking Requests
        </h2>


        {/* Show a message when there are no booking requests */}
        {bookings.length === 0 ? (
          <div className="alert alert-secondary">
            No booking requests.
          </div>
        ) : (
          <div className="row g-4">

            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="col-md-6"
              >
                <div className="card shadow-sm">
                  <div className="card-body">

                    {/* Candidate name */}
                    <h5>
                      {booking.candidate?.name || "Candidate"}
                    </h5>


                    {/* Candidate email */}
                    <p className="text-muted">
                      {booking.candidate?.email}
                    </p>


                    {/* Session date and time */}
                    <p>
                      <strong>Session:</strong>{" "}
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


                    {/* Show meeting link after approval */}
                    {booking.status === "approved" &&
                      booking.meetingLink && (
                        <p>
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Meeting link
                          </a>
                        </p>
                      )}


                    {/* Show action buttons only for pending bookings */}
                    {booking.status === "pending" && (
                      <div className="d-flex gap-2">

                        {/* Approve the booking */}
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleAction(
                              booking._id,
                              "approve"
                            )
                          }
                        >
                          Approve
                        </button>


                        {/* Decline the booking */}
                        <button
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleAction(
                              booking._id,
                              "decline"
                            )
                          }
                        >
                          Decline
                        </button>

                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>

    </div>
  );
}


// Export the page so App.jsx can use it
export default MentorDashboard;