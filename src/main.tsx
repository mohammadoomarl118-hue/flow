import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import FlowProvider from "./context/FlowContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <FlowProvider>
          <App />
        </FlowProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);