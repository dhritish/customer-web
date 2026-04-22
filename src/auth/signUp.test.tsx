import { describe, vi, expect, it } from "vitest";
import { useAuth } from "../contexts/authContext/authContext";
import { checkValidity_signUp } from "./utils";
import type { UserType, AuthContextType } from "../contexts/authContext/Types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "./signUp";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";

vi.mock("../contexts/authContext/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./utils", () => ({
  checkValidity_signUp: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const originalModule: any = await importOriginal();
  return {
    ...originalModule,
    useNavigate: vi.fn(),
  };
});

const mockedUseAuth = vi.mocked(useAuth);
const mockedCheckValidity = vi.mocked(checkValidity_signUp);
const mockedUseNavigate = vi.mocked(useNavigate);

const baseUser: UserType = {
  username: "leo",
  email: "leo@example.com",
  password: "secret",
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
mockedUseNavigate.mockReturnValue(vi.fn());
const mockedsetError = vi.mocked(authValue.setError);
const mockedsignUp = vi.mocked(authValue.signUp);

describe("signUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error when user is not valid", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(false);
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    await user.type(screen.getByPlaceholderText("Username"), "leo");
    await user.type(screen.getByPlaceholderText("Password"), "s");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsetError).toHaveBeenCalledWith("Invalid user information");
    expect(mockedsignUp).not.toHaveBeenCalled();
  });

  it('successful sign up and navigate to "/otp"', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);
    mockedCheckValidity.mockReturnValue(true);
    mockedsignUp.mockResolvedValue({ success: true });
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsignUp).toHaveBeenCalledWith();
    expect(navigate).toHaveBeenCalledWith("/otp");
    expect(mockedsetError).toHaveBeenCalledWith(null);
  });

  it("network error", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(true);
    mockedsignUp.mockRejectedValue(new Error("Network down"));
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsignUp).toHaveBeenCalledWith();
    expect(mockedsetError).toHaveBeenCalledWith("Network down");
  });

  it("unsuccessful sign up", async () => {
    const user = userEvent.setup();
    mockedCheckValidity.mockReturnValue(true);
    mockedsignUp.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(mockedCheckValidity).toHaveBeenCalledWith(authValue.user);
    expect(mockedsignUp).toHaveBeenCalledWith();
    expect(mockedsetError).toHaveBeenCalledWith("Invalid credentials");
  });
});
