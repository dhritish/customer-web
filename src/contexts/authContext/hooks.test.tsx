import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGetAccessToken } from "./hooks";

const refresh = vi.fn();
const setAccessToken = vi.fn();
const setIsLoading = vi.fn();

describe("useGetAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ success case
  it("sets access token when refresh succeeds", async () => {
    refresh.mockResolvedValue({
      success: true,
      accessToken: "token123",
    });

    renderHook(() =>
      useGetAccessToken({
        refresh,
        setAccessToken,
        setIsLoading,
      }),
    );

    // wait for async effect
    await Promise.resolve();

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(refresh).toHaveBeenCalled();
    expect(setAccessToken).toHaveBeenCalledWith("token123");
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
  });

  // ✅ unsuccessful response
  it("does not set token if success is false", async () => {
    refresh.mockResolvedValue({
      success: false,
    });

    renderHook(() =>
      useGetAccessToken({
        refresh,
        setAccessToken,
        setIsLoading,
      }),
    );

    await Promise.resolve();

    expect(refresh).toHaveBeenCalled();
    expect(setAccessToken).not.toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
  });

  // ✅ error case
  it("handles error correctly", async () => {
    refresh.mockRejectedValue(new Error("Network error"));

    renderHook(() =>
      useGetAccessToken({
        refresh,
        setAccessToken,
        setIsLoading,
      }),
    );

    await Promise.resolve();

    expect(refresh).toHaveBeenCalled();
    expect(setAccessToken).not.toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
  });
});
