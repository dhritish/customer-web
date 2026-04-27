import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type CartContextType, type ProductType } from "./Types";
import { useRetry } from "../retryLogic/autoRetry";
import {
  addToCart as add,
  decreaseQuantity,
  removeFromCart as remove,
} from "./apiCalls";
import { useGetCart } from "./hooks";
import { useAuth } from "../authContext/authContext";

const cartContext = createContext<CartContextType | null>(null);

export default function CartPorvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const { autoRetry } = useRetry();
  const { accessToken } = useAuth();

  const addToCart = useCallback(
    async (product: ProductType) => {
      console.log(product);
      const res = await autoRetry({ product }, add);
      if (res.success === false) {
        console.log(res.error);
      } else {
        setCartItems((prev) => {
          const index = prev.findIndex((item) => item._id === product._id);
          if (index === -1) {
            return [...prev, product];
          } else {
            prev[index].quantity++;
            return [...prev];
          }
        });
        setCartTotal((prev) => prev + product.price);
      }
    },
    [setCartItems, setCartTotal, autoRetry],
  );

  const decreaseFromCart = useCallback(
    async (product: ProductType) => {
      const res = await autoRetry({ product }, decreaseQuantity);
      if (res.success === false) {
        console.log(res.error);
      } else {
        setCartItems((prev) => {
          const index = prev.findIndex((item) => item._id === product._id);
          if (index === -1) {
            return [...prev];
          } else {
            prev[index].quantity--;
            if (prev[index].quantity === 0) {
              prev.splice(index, 1);
            }
            return [...prev];
          }
        });
        setCartTotal((prev) => prev - product.price);
      }
    },
    [setCartItems, setCartTotal, autoRetry],
  );

  const removeFromCart = useCallback(
    async (product: ProductType) => {
      const res = await autoRetry({ product }, remove);
      if (res.success === false) {
        console.log(res.error);
      } else {
        setCartItems((prev) => {
          const index = prev.findIndex((item) => item._id === product._id);
          if (index === -1) {
            return [...prev];
          } else {
            prev.splice(index, 1);
            return [...prev];
          }
        });
        setCartTotal((prev) => prev - product.price * product.quantity);
      }
    },
    [setCartItems, setCartTotal, autoRetry],
  );

  useGetCart({ setCartItems, setCartTotal, accessToken });

  const value: CartContextType = {
    addToCart,
    cartTotal,
    cartItems,
    setCartItems,
    setCartTotal,
    decreaseFromCart,
    removeFromCart,
  };

  return <cartContext.Provider value={value}>{children}</cartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
