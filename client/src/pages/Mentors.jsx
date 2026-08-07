// React hooks used to manage mentor data, search text and loading state
import { useEffect, useState } from "react";

// Axios is used to call the backend API
import axios from "axios";

// Link is used to open an individual mentor profile
import { Link } from "react-router-dom";


function Mentors() {
  // Store the mentor list returned by the backend
  const [mentors, setMentors] = useState([]);

  // Store the skill entered in the search box
  const [skill, setSkill] = useState("");

  // Track whether mentor data is still loading
  const [loading, setLoading] = useState(true);


  // Load mentors from the backend
  // A skill can be passed when searching
  const fetchMentors = async (searchSkill = "") => {
    try {
      // Show loading while the request is running
      setLoading(true);


      // Start with the main mentor API URL
      let url = "http://localhost:5000/api/mentors";


      // Add a skill query when the user searches
      if (searchSkill) {
        url += `?skill=${searchSkill}`;
      }


      // Request mentor data from the backend
      const response = await axios.get(url);


      // Save the returned mentors
      setMentors(response.data.mentors);

    } catch (error) {
      // Show an error in the browser console if loading fails
      console.error("Error loading mentors:", error);

    } finally {
      // Stop the loading state
      setLoading(false);
    }
  };


  // Load all mentors when the page first opens
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mentors")
      .then((response) => {
        // Save the mentor list after the request finishes
        setMentors(response.data.mentors);
      })
      .catch((error) => {
        console.error("Error loading mentors:", error);
      })
      .finally(() => {
        // Stop showing the loading message
        setLoading(false);
      });
  }, []);


  // Search mentors using the entered skill
  const handleSearch = (e) => {
    // Prevent the browser from refreshing
    e.preventDefault();

    fetchMentors(skill);
  };


  return (
    <div className="container py-5">

      {/* Page heading */}
      <div className="mb-4">
        <h1>Find a Mentor</h1>

        <p className="text-muted">
          Browse mentors and filter by expertise.
        </p>
      </div>


      {/* Mentor search form */}
      <form
        className="row g-2 mb-5"
        onSubmit={handleSearch}
      >

        {/* Search input */}
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by skill, e.g. React, AWS, Node.js"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>


        {/* Search button */}
        <div className="col-md-2">
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Search
          </button>
        </div>


        {/* Clear the current search */}
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSkill("");
              fetchMentors("");
            }}
          >
            Clear
          </button>
        </div>
      </form>


      {/* Show loading text while data is being requested */}
      {loading ? (
        <p>Loading mentors...</p>

      ) : mentors.length === 0 ? (
        // Show this when no mentors match the search
        <div className="alert alert-info">
          No mentors found.
        </div>

      ) : (
        // Show the mentor cards
        <div className="row g-4">

          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="col-md-6 col-lg-4"
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">

                  {/* Mentor name */}
                  <h4 className="card-title">
                    {mentor.name}
                  </h4>


                  {/* Mentor bio */}
                  <p className="text-muted">
                    {mentor.bio || "Mentor profile"}
                  </p>


                  {/* Mentor expertise tags */}
                  <div className="mb-3">
                    {mentor.expertise?.map((item) => (
                      <span
                        key={item}
                        className="badge bg-primary me-2 mb-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>


                  {/* Count only slots that are still available */}
                  <p>
                    <strong>Available slots:</strong>{" "}
                    {
                      mentor.availableSlots?.filter(
                        (slot) => !slot.isBooked
                      ).length
                    }
                  </p>


                  {/* Open the selected mentor profile */}
                  <Link
                    to={`/mentors/${mentor._id}`}
                    className="btn btn-outline-primary"
                  >
                    View Profile
                  </Link>

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
export default Mentors;