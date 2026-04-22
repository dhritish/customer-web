import { describe, vi, expect, beforeEach } from "vitest";
import { useGetAccessToken } from "./hooks";
import AuthProvider, { useAuth } from "./authContext";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

vi.mock("./hooks", () => {
  return {
    useGetAccessToken: vi.fn(),
  };
});

globalThis.fetch = vi.fn();
const mockedUseGetAccessToken = vi.mocked(useGetAccessToken);

function TestComponent() {
  const { signIn, signUp, submitOTP, refresh, signOut } = useAuth();
  return (
    <>
      <button
        onClick={() => {
          signIn();
        }}
      >
        signin
      </button>
      <button
        onClick={() => {
          signUp();
        }}
      >
        signup
      </button>
      <button
        onClick={() => {
          submitOTP();
        }}
      >
        submitOTP
      </button>
      <button
        onClick={() => {
          refresh();
        }}
      >
        refresh
      </button>
      <button
        onClick={() => {
          signOut();
        }}
      >
        signout
      </button>
    </>
  );
}

describe("authContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_BASE_URL = "baseUrl";
  });

  it("signin function called", async () => {
    (fetch as any).mockResolvedValue({
      json: async () => {
        return {
          success: true,
          accessToken: "token",
        };
      },
    });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(mockedUseGetAccessToken).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /signin/i }));
    expect(fetch).toHaveBeenCalledWith(
      "baseUrl/auth/signIn",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "Client-Type": "web",
        }),
        credentials: "include",
      }),
    );
  });

  it("signUp function called", async () => {
    (fetch as any).mockResolvedValue({
      json: async () => {
        return {
          success: true,
        };
      },
    });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(mockedUseGetAccessToken).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /signup/i }));
    expect(fetch).toHaveBeenCalledWith(
      "baseUrl/auth/signUp",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("submitOTP function called", async () => {
    (fetch as any).mockResolvedValue({
      json: async () => {
        return {
          success: true,
        };
      },
    });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(mockedUseGetAccessToken).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /submitOTP/i }));
    expect(fetch).toHaveBeenCalledWith(
      "baseUrl/auth/submitOTP",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("refresh function called", async () => {
    (fetch as any).mockResolvedValue({
      json: async () => {
        return {
          success: true,
        };
      },
    });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(mockedUseGetAccessToken).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /refresh/i }));
    expect(fetch).toHaveBeenCalledWith(
      "baseUrl/auth/refresh",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "Client-Type": "web",
        }),
        credentials: "include",
      }),
    );
  });

  it("signOut function called", async () => {
    (fetch as any).mockResolvedValue({
      json: async () => {
        return {
          success: true,
        };
      },
    });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(mockedUseGetAccessToken).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /signout/i }));
    expect(fetch).toHaveBeenCalledWith(
      "baseUrl/auth/signOut",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "Client-Type": "web",
        }),
        credentials: "include",
      }),
    );
  });
});
