import React from "react";
import { createRoot } from "react-dom/client";
import BirthdayApp from "./BirthdayApp";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dancing-script/latin-400.css";
import "@fontsource/caveat/latin-400.css";
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BirthdayApp />
  </React.StrictMode>,
);
