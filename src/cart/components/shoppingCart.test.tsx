import { vi, it, describe, expect, beforeEach } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { ShoppingCart } from "./shoppingCart";
import { useCart } from "../../contexts/cartContext/cartContext";
import type { CartContextType } from "../../contexts/cartContext/Types";

vi.mock("../../contexts/cartContext/cartContext", () => ({
  useCart: vi.fn(),
}));

const mockedUseCart = vi.mocked(useCart);

const cartValue: CartContextType = {
  cartItems: [
    {
      _id: "1",
      name: "product1",
      price: 100,
      quantity: 2,
      url: "url1",
      stock: 10,
    },
  ],
  setCartItems: vi.fn(),
  setCartTotal: vi.fn(),
  cartTotal: 200,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  decreaseFromCart: vi.fn(),
};

mockedUseCart.mockReturnValue(cartValue);

const mockedAddToCart = vi.mocked(cartValue.addToCart);
const mockedRemoveFromCart = vi.mocked(cartValue.removeFromCart);
const mockedDecreaseFromCart = vi.mocked(cartValue.decreaseFromCart);

describe("ShoppingCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("remove from cart", async () => {
    render(<ShoppingCart />);
    const icons = document.querySelectorAll(".incDecIcon");
    fireEvent.click(icons[0]);
    expect(mockedRemoveFromCart).toHaveBeenCalledWith(cartValue.cartItems[0]);
  });

  it("decrease from cart", async () => {
    render(<ShoppingCart />);
    const icons = document.querySelectorAll(".incDecIcon");
    fireEvent.click(icons[1]);
    expect(mockedDecreaseFromCart).toHaveBeenCalledWith(cartValue.cartItems[0]);
  });

  it("add to cart", async () => {
    render(<ShoppingCart />);
    const icons = document.querySelectorAll(".incDecIcon");
    fireEvent.click(icons[2]);
    expect(mockedAddToCart).toHaveBeenCalledWith(cartValue.cartItems[0]);
  });
});
