import { useState } from "react";
import "./auth.css";
import type { UserType } from "./Types";
import { Mail, User, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const [user, setUser] = useState<UserType>({
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="container">
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <div className="circle-3"></div>
      <div className="card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Sign in to continue</p>
        <div className="withIcon">
          <User className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={user?.userName}
            onChange={(text) =>
              setUser({ ...user, userName: text.target.value })
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

        <button>Sign In</button>

        <p className="footer">
          Don't have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
}
