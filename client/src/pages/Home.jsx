// React hooks used to manage mentor data and run code when the page loads
import { useEffect, useState } from "react";

// Axios is used to request mentor data from the backend
import axios from "axios";

// React Slick is used for the featured mentor carousel
import SliderModule from "react-slick";

// AOS is used for simple scroll animations
import AOS from "aos";

// Link is used for navigation without refreshing the page
import { Link } from "react-router-dom";


// Handle the React Slick module correctly with Vite
const Slider = SliderModule.default || SliderModule;


function Home() {
  // Store the mentors received from the backend
  const [mentors, setMentors] = useState([]);


  // Run when the home page first loads
  useEffect(() => {
    // Start AOS animations
    AOS.init({
      duration: 700,
      once: true,
    });


    // Load mentors from the backend
    const loadMentors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/mentors"
        );

        // Save the mentor list in state
        setMentors(response.data.mentors);

      } catch (error) {
        // Show the error in the browser console if loading fails
        console.error("Could not load mentors:", error);
      }
    };


    // Call the function when the page opens
    loadMentors();

  }, []);


  // Settings used by the featured mentor carousel
  const settings = {
    // Show navigation dots under the carousel
    dots: true,

    // Only use infinite scrolling when there are enough mentors
    infinite: mentors.length > 3,

    // Animation speed between slides
    speed: 500,

    // Show up to three mentors on larger screens
    slidesToShow: Math.min(3, mentors.length || 1),

    // Move one mentor at a time
    slidesToScroll: 1,

    // Adjust the carousel for tablets and mobile devices
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(2, mentors.length || 1),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  return (
    <>
      {/* Main introduction section */}
      <section className="hero">
        <div data-aos="fade-up">
          <h1>
            Find the right mentor for your career
          </h1>

          <p>
            Connect with experienced professionals, choose an available
            time and book a mentoring session.
          </p>

          {/* Take the user to the mentor listing page */}
          <Link
            to="/mentors"
            className="btn btn-primary btn-lg"
          >
            Find a Mentor
          </Link>
        </div>
      </section>


      {/* Featured mentor section */}
      <section className="container py-5">
        <div
          className="text-center mb-4"
          data-aos="fade-up"
        >
          <h2>Featured Mentors</h2>

          <p className="text-muted">
            Browse experienced mentors and find the right match.
          </p>
        </div>


        {/* Only show the carousel when mentors are available */}
        {mentors.length > 0 && (
          <Slider {...settings}>
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="px-2"
              >
                {/* Mentor card */}
                <div
                  className="card h-100 shadow-sm"
                  data-aos="fade-up"
                >
                  <div className="card-body">
                    <h4>{mentor.name}</h4>

                    {/* Use a default description if no bio is available */}
                    <p className="text-muted">
                      {mentor.bio || "Experienced mentor"}
                    </p>


                    {/* Display up to three areas of expertise */}
                    <div className="mb-3">
                      {mentor.expertise
                        ?.slice(0, 3)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="badge bg-primary me-2 mb-2"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>


                    {/* Open the selected mentor's profile */}
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
          </Slider>
        )}
      </section>


      {/* Simple explanation of how the platform works */}
      <section className="container py-5">
        <div className="row text-center g-4">

          {/* Step 1 */}
          <div
            className="col-md-4"
            data-aos="fade-up"
          >
            <h4>1. Find a Mentor</h4>

            <p className="text-muted">
              Search mentors by their area of expertise.
            </p>
          </div>


          {/* Step 2 */}
          <div
            className="col-md-4"
            data-aos="fade-up"
          >
            <h4>2. Choose a Time</h4>

            <p className="text-muted">
              Select one of the mentor's available time slots.
            </p>
          </div>


          {/* Step 3 */}
          <div
            className="col-md-4"
            data-aos="fade-up"
          >
            <h4>3. Meet & Learn</h4>

            <p className="text-muted">
              Receive confirmation and join using the meeting link.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}


// Export the Home page so App.jsx can use it
export default Home;