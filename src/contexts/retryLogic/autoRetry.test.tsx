import { describe, vi, it, expect } from "vitest";
import { useAuth } from "../authContext/authContext.tsx";
import type { AuthContextType } from "../authContext/Types";
import { AutoRetryProvider, useRetry } from "./autoRetry";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../authContext/authContext.tsx", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

const authValue: AuthContextType = {
  user: {
    username: "",
    email: "",
    password: "",
    role: "customer",
    otp: "",
  },
  setUser: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  submitOTP: vi.fn(),
  accessToken: "access token",
  error: null,
  setAccessToken: vi.fn(),
  setError: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn(),
  isLoading: false,
  setIsLoading: vi.fn(),
};

function TestComponent() {
  const { autoRetry } = useRetry();
  async function VAT() {
    return {
      success: true,
    };
  }
  async function expiredToken() {
    return {
      success: false,
      error: "TokenExpiredError",
    };
  }

  async function networkError() {
    return {
      success: false,
      error: "Network down",
    };
  }

  async function invalidToken() {
    return {
      success: false,
      error: "Invalid token",
    };
  }

  return (
    <div>
      <button
        onClick={() => {
          autoRetry({}, VAT);
        }}
      >
        valid access token
      </button>
      <button
        onClick={() => {
          autoRetry({}, expiredToken);
        }}
      >
        expired access token
      </button>
      <button
        onClick={() => {
          autoRetry({}, networkError);
        }}
      >
        network error
      </button>
      <button
        onClick={() => {
          autoRetry({}, invalidToken);
        }}
      >
        invalid token
      </button>
    </div>
  );
}

mockedUseAuth.mockReturnValue(authValue);
const mockedSetAccessToken = vi.mocked(authValue.setAccessToken);
const mockedRefresh = vi.mocked(authValue.refresh);

describe("Retry Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valid access token", async () => {
    render(
      <AutoRetryProvider>
        <TestComponent />
      </AutoRetryProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("valid access token"));
    expect(mockedRefresh).not.toHaveBeenCalled();
    expect(mockedSetAccessToken).not.toHaveBeenCalled();
  });

  it("expired access token", async () => {
    mockedRefresh.mockResolvedValue({
      success: true,
      accessToken: "new token",
    });
    const user = userEvent.setup();
    render(
      <AutoRetryProvider>
        <TestComponent />
      </AutoRetryProvider>,
    );
    await user.click(screen.getByText("expired access token"));
    expect(mockedRefresh).toHaveBeenCalled();
    expect(mockedSetAccessToken).toHaveBeenCalledWith("new token");
  });

  it("network error", async () => {
    const user = userEvent.setup();
    render(
      <AutoRetryProvider>
        <TestComponent />
      </AutoRetryProvider>,
    );
    await user.click(screen.getByText("network error"));
    expect(mockedRefresh).not.toHaveBeenCalled();
    expect(mockedSetAccessToken).not.toHaveBeenCalled();
  });

  it("invalid token", async () => {
    const user = userEvent.setup();
    render(
      <AutoRetryProvider>
        <TestComponent />
      </AutoRetryProvider>,
    );
    await user.click(screen.getByText("invalid token"));
    expect(mockedRefresh).not.toHaveBeenCalled();
    expect(mockedSetAccessToken).not.toHaveBeenCalled();
  });
});
