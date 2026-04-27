import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartProvider, { useCart } from "./cartContext";
import { useRetry } from "../retryLogic/autoRetry";
import { useAuth } from "../authContext/authContext";
import { useGetCart } from "./hooks";
import {
  addToCart as addToCartApi,
  decreaseQuantity,
  removeFromCart as removeFromCartApi,
} from "./apiCalls";
import type { ProductType } from "./Types";

vi.mock("../retryLogic/autoRetry", () => ({
  useRetry: vi.fn(),
}));

vi.mock("../authContext/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./hooks", () => ({
  useGetCart: vi.fn(),
}));

const mockedUseRetry = vi.mocked(useRetry);
const mockedUseAuth = vi.mocked(useAuth);
const mockedUseGetCart = vi.mocked(useGetCart);
const mockedAutoRetry = vi.fn();

const product: ProductType = {
  _id: "1",
  name: "product1",
  price: 100,
  quantity: 1,
  url: "url1",
  stock: 10,
};

function TestComponent() {
  const { addToCart, removeFromCart, decreaseFromCart, cartItems, cartTotal } =
    useCart();

  return (
    <div>
      <p>total: {cartTotal}</p>
      <p>items: {cartItems.length}</p>
      <p>quantity: {cartItems[0]?.quantity ?? 0}</p>
      <button onClick={() => addToCart({ ...product })}>Add to cart</button>
      <button onClick={() => removeFromCart({ ...product })}>
        Remove from cart
      </button>
      <button onClick={() => decreaseFromCart({ ...product })}>
        Decrease from cart
      </button>
    </div>
  );
}

function renderCartProvider() {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>,
  );
}

describe("cartContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAutoRetry.mockResolvedValue({ success: true });
    mockedUseRetry.mockReturnValue({ autoRetry: mockedAutoRetry });
    mockedUseAuth.mockReturnValue({ accessToken: "token" } as any);
  });

  it("loads cart on render", () => {
    renderCartProvider();

    expect(mockedUseGetCart).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "token",
        setCartItems: expect.any(Function),
        setCartTotal: expect.any(Function),
      }),
    );
  });

  it("adds product to cart", async () => {
    const user = userEvent.setup();
    renderCartProvider();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(mockedAutoRetry).toHaveBeenCalledWith({ product }, addToCartApi);
    await waitFor(() => {
      expect(screen.getByText("items: 1")).toBeInTheDocument();
      expect(screen.getByText("total: 100")).toBeInTheDocument();
    });
  });

  it("increases quantity when product is already in cart", async () => {
    const user = userEvent.setup();
    renderCartProvider();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    await waitFor(() => {
      expect(screen.getByText("items: 1")).toBeInTheDocument();
      expect(screen.getByText("quantity: 2")).toBeInTheDocument();
      expect(screen.getByText("total: 200")).toBeInTheDocument();
    });
  });

  it("decreases product quantity from cart", async () => {
    const user = userEvent.setup();
    renderCartProvider();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(
      screen.getByRole("button", { name: /decrease from cart/i }),
    );

    expect(mockedAutoRetry).toHaveBeenLastCalledWith(
      { product },
      decreaseQuantity,
    );
    await waitFor(() => {
      expect(screen.getByText("items: 1")).toBeInTheDocument();
      expect(screen.getByText("quantity: 1")).toBeInTheDocument();
      expect(screen.getByText("total: 100")).toBeInTheDocument();
    });
  });

  it("removes product from cart", async () => {
    const user = userEvent.setup();
    renderCartProvider();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /remove from cart/i }));

    expect(mockedAutoRetry).toHaveBeenLastCalledWith(
      { product },
      removeFromCartApi,
    );
    await waitFor(() => {
      expect(screen.getByText("items: 0")).toBeInTheDocument();
      expect(screen.getByText("total: 0")).toBeInTheDocument();
    });
  });

  it("does not update cart when api returns an error", async () => {
    mockedAutoRetry.mockResolvedValue({ success: false, error: "failed" });
    const user = userEvent.setup();
    renderCartProvider();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(screen.getByText("items: 0")).toBeInTheDocument();
    expect(screen.getByText("total: 0")).toBeInTheDocument();
  });
});
