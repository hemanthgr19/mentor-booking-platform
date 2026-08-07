// Import the Chart.js parts needed for the doughnut chart
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Import the Doughnut chart component for React
import { Doughnut } from "react-chartjs-2";


// Register the Chart.js features used on this page
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


function Stats() {
  // Data displayed inside the booking statistics chart
  const data = {
    // Booking status labels
    labels: [
      "Pending",
      "Approved",
      "Declined",
    ],

    // Number of bookings for each status
    datasets: [
      {
        label: "Bookings",

        // Temporary sample values used to demonstrate the chart
        data: [2, 4, 1],
      },
    ],
  };


  return (
    <div className="container py-5">

      {/* Page heading */}
      <h1 className="mb-4">
        Booking Statistics
      </h1>


      {/* Keep the chart at a comfortable size */}
      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto",
        }}
      >
        {/* Display booking statistics as a doughnut chart */}
        <Doughnut data={data} />
      </div>

    </div>
  );
}


// Export the page so App.jsx can use it
export default Stats;