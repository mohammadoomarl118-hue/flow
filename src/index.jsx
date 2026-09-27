import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import FlowProvider from "./context/FlowContext";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <FlowProvider>
          <App />
        </FlowProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);