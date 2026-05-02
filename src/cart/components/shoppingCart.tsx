import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../contexts/cartContext/cartContext";
import "../cart.css";
import type { CartItemPropsType } from "../Types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductType } from "../../contexts/cartContext/Types";

export function ShoppingCart() {
  const { cartItems, cartTotal, addToCart, removeFromCart, decreaseFromCart } =
    useCart();
  const navigate = useNavigate();

  const handleRemoveFromCart = useCallback(
    async (product: ProductType) => {
      try {
        await removeFromCart(product);
      } catch (error) {
        console.log(error);
      }
    },
    [removeFromCart],
  );

  const handleAddToCart = useCallback(
    async (product: ProductType) => {
      try {
        await addToCart(product);
      } catch (error) {
        console.log(error);
      }
    },
    [addToCart],
  );

  const handleDecreaseFromCart = useCallback(
    async (product: ProductType) => {
      try {
        await decreaseFromCart(product);
      } catch (error) {
        console.log(error);
      }
    },
    [decreaseFromCart],
  );

  const isCartEmpty = cartItems.length === 0;
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="cartWindow">
      <div className="cartWindowHeader">
        <div>
          <h2>Items</h2>
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {isCartEmpty ? (
        <div className="emptyCart">
          <h3>Your cart is empty</h3>
          <p>Add products to your cart and they will show up here.</p>
          <button
            className="continueShoppingButton"
            onClick={() => {
              navigate("/home");
            }}
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="cartItemsList">
          {cartItems.map((cartItem) => (
            <CartItemCard
              key={cartItem._id}
              cartItem={cartItem}
              handleRemoveFromCart={handleRemoveFromCart}
              handleAddToCart={handleAddToCart}
              handleDecreaseFromCart={handleDecreaseFromCart}
            />
          ))}
        </div>
      )}

      <div className="cartSummary">
        <span>Subtotal</span>
        <strong>₹{cartTotal}</strong>
      </div>
      <button
        className="checkoutButton"
        disabled={isCartEmpty}
        onClick={() => {
          navigate("/checkout");
        }}
      >
        Checkout
      </button>
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
          className="cartItemImage"
          src={
            cartItem.url ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7H5SO_PbMIDuCocFhyTIbet6O18XKTpOrqY0QURzlCBm939T2hMG0eMc&s"
          }
          alt={cartItem.name ?? "Product image"}
        />
      </div>
      <div className="cartItemInfo">
        <span className="cartItemName">{cartItem.name}</span>
        <span className="cartItemPrice">₹{cartItem.price}</span>
        <span className="cartItemStock">{cartItem.stock} in stock</span>
        <div className="cartActions">
          <button
            className="removeCartButton incDecIcon"
            type="button"
            aria-label={`Remove ${cartItem.name} from cart`}
            onClick={() => {
              handleRemoveFromCart(cartItem);
            }}
          >
            <Trash2 size={18} />
          </button>
          <div className="incDec">
            <button
              className="incDecIcon"
              type="button"
              aria-label={`Decrease ${cartItem.name} quantity`}
              onClick={() => {
                handleDecreaseFromCart(cartItem);
              }}
            >
              <Minus size={18} />
            </button>
            <span>{cartItem.quantity}</span>
            <button
              className="incDecIcon"
              type="button"
              aria-label={`Increase ${cartItem.name} quantity`}
              onClick={() => {
                handleAddToCart(cartItem);
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
