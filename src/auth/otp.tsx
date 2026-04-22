import { useAuth } from "../contexts/authContext/authContext";
import "./auth.css";

export default function OTP() {
  const { user, setUser, error, setError, submitOTP } = useAuth();

  const handleOTP = async () => {
    try {
      if (user.otp?.length !== 6) {
        return setError("Invalid OTP");
      }
      const res = await submitOTP();
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
            value={user.otp}
            onChange={(text) => setUser({ ...user, otp: text.target.value })}
          />
        </div>
        <button
          onClick={() => {
            handleOTP();
          }}
        >
          Submit
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
