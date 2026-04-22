import { useState } from "react";
import "./auth.css";
import { Mail, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/authContext";
import { checkValidity_signUp as checkValidity } from "./utils";

export default function SignUp() {
  const { user, setUser, error, setError, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    try {
      if (checkValidity(user) === false) {
        return setError("Invalid user information");
      }
      const res = await signUp();
      if (res.success === false) {
        return setError(res.error);
      }
      setError(null);
      navigate("/otp");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setError(msg);
    }
  }

  return (
    <div className="container">
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <div className="circle-3"></div>
      <div className="card">
        <h2>Welcome 👋</h2>
        <p className="subtitle">Sign up to continue</p>
        <div className="withIcon">
          <User className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={user?.username}
            onChange={(text) =>
              setUser({ ...user, username: text.target.value })
            }
          />
        </div>

        <div className="withIcon">
          <Mail className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={user?.email}
            onChange={(text) => setUser({ ...user, email: text.target.value })}
          />
        </div>
        <div className="withIcon">
          {showPassword ? (
            <Eye
              className="icon"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            />
          ) : (
            <EyeOff
              className="icon"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            />
          )}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={user?.password}
            onChange={(text) =>
              setUser({ ...user, password: text.target.value })
            }
          />
        </div>

        <button
          onClick={() => {
            handleSignUp();
          }}
        >
          Sign Up
        </button>

        <p className="footer">
          Already have an account? <Link to="/signIn">Sign in</Link>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
