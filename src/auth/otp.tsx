import { useState } from "react";
import { useAuth } from "../contexts/authContext/authContext";
import type { UserType } from "../contexts/authContext/Types";
import "./auth.css";

export default function OTP() {
  const [otp, setOTP] = useState<string>("");
  const { user, error, setError, submitOTP } = useAuth();

  const handleOTP = async (user: UserType, otp: string) => {
    try {
      if (otp.length !== 6) {
        return setError("Invalid OTP");
      }
      const res = await submitOTP(user, otp);
      if (res.success === false) {
        return setError(res.error);
      }
      setError(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setError(msg);
    }
  };

  return (
    <div className="container">
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <div className="circle-3"></div>
      <div className="card">
        <h2>Enter the six digit code</h2>
        <div className="withIcon">
          <input
            type="text"
            value={otp}
            onChange={(text) => setOTP(text.target.value)}
          />
        </div>
        <button
          onClick={() => {
            handleOTP(user, otp);
          }}
        >
          Submit
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
