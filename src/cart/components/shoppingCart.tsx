import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../contexts/cartContext/cartContext";
import "../cart.css";
import type { CartItemPropsType } from "../Types";
import { useCallback } from "react";

export function ShoppingCart() {
  const { cartItems, cartTotal, addToCart, removeFromCart, decreaseFromCart } =
    useCart();

  const handleRemoveFromCart = useCallback(
    async (product: any) => {
      try {
        await removeFromCart(product);
      } catch (error) {
        console.log(error);
      }
    },
    [removeFromCart],
  );

  const handleAddToCart = useCallback(
    async (product: any) => {
      try {
        await addToCart(product);
      } catch (error) {
        console.log(error);
      }
    },
    [addToCart],
  );

  const handleDecreaseFromCart = useCallback(
    async (product: any) => {
      try {
        await decreaseFromCart(product);
      } catch (error) {
        console.log(error);
      }
    },
    [decreaseFromCart],
  );

  return (
    <div className="cartWindow">
      {cartItems.map((cartItem) => (
        <CartItemCard
          key={cartItem._id}
          cartItem={cartItem}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddToCart={handleAddToCart}
          handleDecreaseFromCart={handleDecreaseFromCart}
        />
      ))}
      <span className="total">Total: ₹{cartTotal}</span>
    </div>
  );
}

function CartItemCard({
  cartItem,
  handleRemoveFromCart,
  handleAddToCart,
  handleDecreaseFromCart,
}: CartItemPropsType) {
  return (
    <div className="cartContainer">
      <div className="cartImageContainer">
        <img
          className="image"
          src={
            cartItem.url ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7H5SO_PbMIDuCocFhyTIbet6O18XKTpOrqY0QURzlCBm939T2hMG0eMc&s"
          }
          alt={cartItem.name ?? "Product image"}
        />
      </div>
      <div className="cartItemInfo">
        <span>{cartItem.name}</span>
        <span style={{ color: "green", fontWeight: "bold", fontSize: "40px" }}>
          ₹{cartItem.price}
        </span>
        <span>{cartItem.stock} in stock</span>
        <div className="incDec">
          <Trash2
            className="incDecIcon"
            style={{ border: "none" }}
            onClick={() => {
              handleRemoveFromCart(cartItem);
            }}
          />
          <Minus
            className="incDecIcon"
            onClick={() => {
              handleDecreaseFromCart(cartItem);
            }}
          />
          <span style={{ fontSize: "20px", alignContent: "center" }}>
            {cartItem.quantity}
          </span>
          <Plus
            className="incDecIcon"
            style={{ borderRight: "none" }}
            onClick={() => {
              handleAddToCart(cartItem);
            }}
          />
        </div>
      </div>
    </div>
  );
}
