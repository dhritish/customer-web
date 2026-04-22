import { useState } from "react";
import "./auth.css";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext/authContext";
import { checkValidity_signIn as checkValidity } from "./utils";

export default function SignIn() {
  const { user, setUser, error, setError, signIn, setAccessToken } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleSignIn() {
    try {
      if (checkValidity(user) === false) {
        return setError("Invalid user information");
      }
      const res = await signIn();
      if (res.success === false) {
        return setError(res.error);
      }
      setAccessToken(res.accessToken);
      setError(null);
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
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Sign in to continue</p>

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
            handleSignIn();
          }}
        >
          Sign In
        </button>

        <p className="footer">
          Don't have an account? <Link to="/signUp">Sign up</Link>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
