import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import SignIn from "./auth/signIn";
import SignUp from "./auth/signUp";
import OTP from "./auth/otp";
import { useAuth } from "./contexts/authContext/authContext";
import Home from "./home/home";
import Cart from "./cart/cart";
import Checkout from "./cart/Checkout";
import Order from "./order/order";
import { useState } from "react";

function App() {
  const [dropDownOpen, setDropDownOpen] = useState(false);
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
              to="/order"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Order
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Cart
            </NavLink>
            <div className="profile">
              <span
                onClick={() => {
                  setDropDownOpen((prev) => !prev);
                }}
              >
                Profile
              </span>
              {dropDownOpen && <Dropdown />}
            </div>
          </nav>
          <Routes>
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </>
      )}
    </div>
  );
}

function Dropdown() {
  const { profile, signOut, setAccessToken } = useAuth();
  const navigatie = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (res.success) {
        setAccessToken(null);
        navigatie("/");
      } else {
        console.log(res.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dropdown">
      <div className="dropdown-content">
        <span>{profile?.username}</span>
        <span>{profile?.email}</span>
        <span>{profile?.role}</span>
        <span
          onClick={() => {
            handleSignOut();
          }}
          className="logout"
        >
          Logout
        </span>
      </div>
    </div>
  );
}

export default App;
