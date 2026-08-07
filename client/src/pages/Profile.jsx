// React hooks used to load and update the profile
import { useEffect, useState } from "react";

// Redux is used to get the logged-in user and token
import { useSelector } from "react-redux";

// Axios is used to communicate with the backend
import axios from "axios";


function Profile() {
  // Get authentication information from Redux
  const { token, user } = useSelector((state) => state.auth);


  // Store the profile form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    expertise: [],
  });


  // Store the text entered for a new skill or expertise tag
  const [newTag, setNewTag] = useState("");


  // Store success or error messages
  const [message, setMessage] = useState("");


  // Track whether the profile is loading
  const [loading, setLoading] = useState(true);


  // Load the user's profile when the page opens
  useEffect(() => {
    // Stop if there is no login token
    if (!token) {
      return;
    }


    // Request the current profile from the backend
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
        const profile = response.data.user;


        // Put the profile information into the form
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          bio: profile.bio || "",
          skills: profile.skills || [],
          expertise: profile.expertise || [],
        });
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message ||
            "Could not load profile"
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, [token]);


  // Update normal text fields such as name and bio
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Add a new skill or expertise tag
  const handleAddTag = () => {
    // Remove spaces from the beginning and end
    const tag = newTag.trim();


    // Do nothing if the input is empty
    if (!tag) {
      return;
    }


    // Candidates manage skills
    if (user?.role === "candidate") {
      // Avoid adding the same skill twice
      if (!formData.skills.includes(tag)) {
        setFormData({
          ...formData,
          skills: [...formData.skills, tag],
        });
      }
    }


    // Mentors manage expertise
    if (user?.role === "mentor") {
      // Avoid adding the same expertise twice
      if (!formData.expertise.includes(tag)) {
        setFormData({
          ...formData,
          expertise: [...formData.expertise, tag],
        });
      }
    }


    // Clear the tag input
    setNewTag("");
  };


  // Remove a skill or expertise tag
  const handleRemoveTag = (tagToRemove) => {
    // Remove a candidate skill
    if (user?.role === "candidate") {
      setFormData({
        ...formData,
        skills: formData.skills.filter(
          (tag) => tag !== tagToRemove
        ),
      });
    }


    // Remove mentor expertise
    if (user?.role === "mentor") {
      setFormData({
        ...formData,
        expertise: formData.expertise.filter(
          (tag) => tag !== tagToRemove
        ),
      });
    }
  };


  // Save the updated profile
  const handleSubmit = async (e) => {
    // Prevent the browser from refreshing
    e.preventDefault();

    // Clear any previous message
    setMessage("");


    try {
      // Build the information that will be sent to the backend
      const updateData = {
        name: formData.name,
        bio: formData.bio,
      };


      // Candidates send their skills
      if (user?.role === "candidate") {
        updateData.skills = formData.skills;
      }


      // Mentors send their expertise
      if (user?.role === "mentor") {
        updateData.expertise = formData.expertise;
      }


      // Update the profile through the backend
      const response = await axios.put(
        "http://localhost:5000/api/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // Show the backend success message
      setMessage(response.data.message);

    } catch (error) {
      // Show an error if the update fails
      setMessage(
        error.response?.data?.message ||
          "Could not update profile"
      );
    }
  };


  // Show this while the profile is loading
  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading profile...</p>
      </div>
    );
  }


  // Stop users from accessing the page without logging in
  if (!token || !user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Please login to view your profile.
        </div>
      </div>
    );
  }


  // Candidates use skills and mentors use expertise
  const currentTags =
    user.role === "candidate"
      ? formData.skills
      : formData.expertise;


  return (
    <div className="container py-5">

      {/* Page heading */}
      <div className="mb-4">
        <h1>My Profile</h1>

        <p className="text-muted">
          Update your profile information.
        </p>
      </div>


      <div className="row">
        <div className="col-lg-8">

          {/* Show success or error messages */}
          {message && (
            <div className="alert alert-info">
              {message}
            </div>
          )}


          {/* Profile form */}
          <form
            onSubmit={handleSubmit}
            className="card shadow-sm"
          >
            <div className="card-body">

              {/* Name */}
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


              {/* Email is displayed but cannot be changed */}
              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                />
              </div>


              {/* Short profile bio */}
              <div className="mb-3">
                <label className="form-label">
                  Short Bio
                </label>

                <textarea
                  name="bio"
                  className="form-control"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short introduction about yourself"
                />
              </div>


              {/* Candidate skills or mentor expertise */}
              <div className="mb-3">
                <label className="form-label">
                  {user.role === "candidate"
                    ? "Skills"
                    : "Expertise"}
                </label>


                {/* Add a new tag */}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={newTag}
                    onChange={(e) =>
                      setNewTag(e.target.value)
                    }
                    placeholder={
                      user.role === "candidate"
                        ? "Example: React"
                        : "Example: AWS"
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>


                {/* Display current tags */}
                <div>
                  {currentTags.length === 0 ? (
                    <p className="text-muted">
                      {user.role === "candidate"
                        ? "No skills added yet."
                        : "No expertise added yet."}
                    </p>
                  ) : (
                    currentTags.map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-primary me-2 mb-2"
                      >
                        {tag}

                        {/* Remove the selected tag */}
                        <button
                          type="button"
                          className="btn btn-sm text-white ms-2 p-0"
                          onClick={() =>
                            handleRemoveTag(tag)
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>


              {/* Save profile */}
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Profile
              </button>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}


// Export the page so it can be used in App.jsx
export default Profile;