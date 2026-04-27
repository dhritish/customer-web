import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import "./App.css";
import SignIn from "./auth/signIn";
import SignUp from "./auth/signUp";
import OTP from "./auth/otp";
import { useAuth } from "./contexts/authContext/authContext";
import Home from "./home/home";
import Map from "./map/map";
import Cart from "./cart/cart";

function App() {
  const { accessToken, isLoading } = useAuth();
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="App">
      {accessToken === null ? (
        <Routes>
          <Route path="/" element={<Navigate to="/signUp" replace />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/otp" element={<OTP />} />
        </Routes>
      ) : (
        <>
          <nav>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Map
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Cart
            </NavLink>
          </nav>
          <Routes>
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
