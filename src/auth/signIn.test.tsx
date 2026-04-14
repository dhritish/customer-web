import { describe, vi, expect, beforeEach } from "vitest";
import { useAuth } from "../contexts/authContext/authContext";
import type { AuthContextType, UserType } from "../contexts/authContext/Types";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import SignIn from "./signIn";
import { checkValidity_signIn } from "./utils";
import { MemoryRouter } from "react-router-dom";

vi.mock("../contexts/authContext/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./utils", () => ({
  checkValidity_signIn: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedCheckValidity = vi.mocked(checkValidity_signIn);

const baseUser: UserType = {
  username: "",
  email: "",
  password: "",
  role: "customer",
  otp: "",
};

const authValue: AuthContextType = {
  user: { ...baseUser },
  setUser: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  submitOTP: vi.fn(),
  accessToken: null,
  error: null,
  setAccessToken: vi.fn(),
  setError: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn(),
  isLoading: false,
  setIsLoading: vi.fn(),
};

mockedUseAuth.mockReturnValue(authValue);
const mockedsetError = vi.mocked(authValue.setError);
const mockedsetAccessToken = vi.mocked(authValue.setAccessToken);
const mockedsignIn = vi.mocked(authValue.signIn);

describe("singIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error when user is not valid", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(false);
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );
    await user.type(screen.getByPlaceholderText("Email"), "leo@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsetError).toHaveBeenCalledWith("Invalid user information");
    expect(mockedsignIn).not.toHaveBeenCalled();
  });

  it("get accessToken when user is valid", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(true);
    mockedsignIn.mockResolvedValue({ success: true, accessToken: "token" });
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );
    await user.type(screen.getByPlaceholderText("Email"), "leo@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsignIn).toHaveBeenCalledWith(authValue.user);
    expect(mockedsetAccessToken).toHaveBeenCalledWith("token");
    expect(mockedsetError).toHaveBeenCalledWith(null);
  });

  it("network error", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(true);
    mockedsignIn.mockRejectedValue(new Error("Network down"));
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );
    await user.type(screen.getByPlaceholderText("Email"), "leo@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsignIn).toHaveBeenCalledWith(authValue.user);
    expect(mockedsetError).toHaveBeenCalledWith("Network down");
  });

  it("unsuccessful signin", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(true);
    mockedsignIn.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );
    await user.type(screen.getByPlaceholderText("Email"), "leo@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsignIn).toHaveBeenCalledWith(authValue.user);
    expect(mockedsetError).toHaveBeenCalledWith("Invalid credentials");
  });
});
