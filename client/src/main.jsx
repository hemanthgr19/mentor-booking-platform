// React StrictMode helps highlight possible problems during development
import { StrictMode } from "react";

// createRoot is used to start the React application
import { createRoot } from "react-dom/client";

// BrowserRouter enables page navigation using React Router
import { BrowserRouter } from "react-router-dom";

// Provider makes the Redux store available throughout the app
import { Provider } from "react-redux";

// Import the Redux store
import { store } from "./app/store";


// Bootstrap provides ready-made layout and UI styles
import "bootstrap/dist/css/bootstrap.min.css";

// Slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// AOS provides scroll animations
import "aos/dist/aos.css";


// Global application styles
import "./index.css";

// Import the main App component
import App from "./App.jsx";


// Start the React application and attach it to the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux is available to all components inside Provider */}
    <Provider store={store}>
      {/* BrowserRouter handles navigation between pages */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);