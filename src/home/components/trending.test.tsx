import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTrending } from "../apiCalls/suggestionAPI";
import { useRetry } from "../../contexts/retryLogic/autoRetry";
import { render, screen, waitFor } from "@testing-library/react";
import { Trending } from "./trending";
import { useCart } from "../../contexts/cartContext/cartContext";

vi.mock("../apiCalls/suggestionAPI", () => ({
  getTrending: vi.fn(),
}));

vi.mock("../../contexts/retryLogic/autoRetry", () => ({
  useRetry: vi.fn(),
}));

vi.mock("../../contexts/cartContext/cartContext", () => ({
  useCart: vi.fn(),
}));

const mockedGetTrending = vi.mocked(getTrending);
const mockedUseRetry = vi.mocked(useRetry);
const mockedUseCart = vi.mocked(useCart);
const useRetryValue = {
  autoRetry: vi.fn(),
};
const useCartValue = {
  addToCart: vi.fn(),
};

mockedUseRetry.mockReturnValue(useRetryValue);
mockedUseCart.mockReturnValue(useCartValue as any);
const mockedAutoRetry = vi.mocked(useRetryValue.autoRetry);

describe("Trending", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successful api call", async () => {
    mockedAutoRetry.mockResolvedValue({
      trendingProducts: [
        {
          _id: "123",
          name: "Product 1",
          price: 100,
          total: 10,
          url: "https://example.com/product1.jpg",
        },
      ],
    });
    render(<Trending />);

    await waitFor(() => {
      expect(mockedAutoRetry).toHaveBeenCalledWith({}, mockedGetTrending);
    });
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("₹100")).toBeInTheDocument();
  });

  it("network error", async () => {
    mockedAutoRetry.mockRejectedValue(new Error("Network error"));
    render(<Trending />);
    await waitFor(() => {
      expect(mockedAutoRetry).toHaveBeenCalledWith({}, mockedGetTrending);
    });
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    expect(screen.queryByText("₹100")).not.toBeInTheDocument();
  });

  it("server side error", async () => {
    mockedAutoRetry.mockResolvedValue({
      trendingProducts: [],
    });
    render(<Trending />);
    await waitFor(() => {
      expect(mockedAutoRetry).toHaveBeenCalledWith({}, mockedGetTrending);
    });
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    expect(screen.queryByText("₹100")).not.toBeInTheDocument();
  });
});
