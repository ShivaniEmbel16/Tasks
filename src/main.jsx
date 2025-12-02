import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);



// ✔ What this does:

// StrictMode → helps catch React errors.

// BrowserRouter → enables URL routing (/task/1, /task/2 etc.).

// App → your main component that contains all page routes.