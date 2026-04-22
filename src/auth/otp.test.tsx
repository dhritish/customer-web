import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OTP from "./otp";
import { useAuth } from "../contexts/authContext/authContext";
import type { AuthContextType, UserType } from "../contexts/authContext/Types";

vi.mock("../contexts/authContext/authContext", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

const baseUser: UserType = {
  username: "leo",
  email: "leo@example.com",
  password: "secret",
  role: "customer",
  otp: "",
};

describe("OTP", () => {
  let authValue: AuthContextType;
  let submitOTP: ReturnType<typeof vi.fn<AuthContextType["submitOTP"]>>;
  let setError: ReturnType<typeof vi.fn<AuthContextType["setError"]>>;
  let setUser: ReturnType<typeof vi.fn<AuthContextType["setUser"]>>;

  beforeEach(() => {
    vi.clearAllMocks();
    submitOTP = vi.fn<AuthContextType["submitOTP"]>();
    setError = vi.fn<AuthContextType["setError"]>();
    setUser = vi.fn<AuthContextType["setUser"]>((value) => {
      authValue.user =
        typeof value === "function" ? value(authValue.user) : value;
    });

    authValue = {
      user: { ...baseUser },
      setUser,
      signIn: vi.fn(),
      signUp: vi.fn(),
      submitOTP,
      accessToken: null,
      error: null,
      setAccessToken: vi.fn(),
      setError,
      refresh: vi.fn(),
      signOut: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
    };

    mockedUseAuth.mockReturnValue(authValue);
  });

  it("shows an error when the OTP is not six digits", async () => {
    const user = userEvent.setup();
    authValue.setUser({ ...authValue.user, otp: "12345" });

    render(<OTP />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(setUser).toHaveBeenCalledWith({ ...baseUser, otp: "12345" });
    expect(setError).toHaveBeenCalledWith("Invalid OTP");
    expect(submitOTP).not.toHaveBeenCalled();
  });

  it("shows the API error when OTP submission fails", async () => {
    const user = userEvent.setup();
    submitOTP.mockResolvedValue({
      success: false,
      error: "OTP expired",
    });
    authValue.setUser({ ...authValue.user, otp: "123456" });

    render(<OTP />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(setUser).toHaveBeenCalledWith({ ...baseUser, otp: "123456" });
    expect(submitOTP).toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith("OTP expired");
  });

  it("clears the error when OTP submission succeeds", async () => {
    const user = userEvent.setup();
    submitOTP.mockResolvedValue({ success: true });
    authValue.setUser({ ...authValue.user, otp: "123456" });

    render(<OTP />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(setUser).toHaveBeenCalledWith({ ...baseUser, otp: "123456" });
    expect(submitOTP).toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith(null);
  });

  it("shows a thrown error message from OTP submission", async () => {
    const user = userEvent.setup();
    submitOTP.mockRejectedValue(new Error("Network down"));
    authValue.setUser({ ...authValue.user, otp: "123456" });

    render(<OTP />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(setUser).toHaveBeenCalledWith({ ...baseUser, otp: "123456" });
    expect(setError).toHaveBeenCalledWith("Network down");
  });
});
