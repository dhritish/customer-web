import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/authContext/authContext.tsx";
import { AutoRetryProvider } from "./contexts/retryLogic/autoRetry.tsx";
import CartPorvider from "./contexts/cartContext/cartContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <AutoRetryProvider>
        <CartPorvider>
          <App />
        </CartPorvider>
      </AutoRetryProvider>
    </AuthProvider>
  </BrowserRouter>,
);
