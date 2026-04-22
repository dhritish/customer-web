import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/authContext/authContext.tsx";
import { AutoRetryProvider } from "./contexts/retryLogic/autoRetry.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AutoRetryProvider>
          <App />
        </AutoRetryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
