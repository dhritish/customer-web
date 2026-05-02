import { useEffect } from "react";
import { useCart } from "../../contexts/cartContext/cartContext";
import { useAuth } from "../../contexts/authContext/authContext";
import { getCart } from "../../contexts/cartContext/apiCalls";
import { useRetry } from "../../contexts/retryLogic/autoRetry";

export function ItemInfo() {
  const { isAccessLoaded } = useAuth();
  const { setCartItems, setCartTotal, cartItems, cartTotal } = useCart();
  const { autoRetry } = useRetry();

  useEffect(() => {
    (async () => {
      if (!isAccessLoaded) return;
      try {
        const res = await autoRetry({}, getCart);
        if (res.success) {
          setCartItems(res.cart);
          const total = res.cart.reduce(
            (acc: number, item: any) => acc + item.price * item.quantity,
            0,
          );
          setCartTotal(total);
        } else {
          console.log(res.error);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isAccessLoaded, setCartItems, setCartTotal, autoRetry]);

  return (
    <div className="orderSummary">
      <div className="checkoutPanelHeader">
        <div>
          <span className="checkoutEyebrow">Items</span>
          <h2>Order summary</h2>
        </div>
      </div>

      <div className="orderSummaryTable">
        <div className="orderSummaryHeader">
          <span>Name</span>
          <span>Qty</span>
          <span>Price</span>
        </div>

        {cartItems?.map((item) => (
          <div className="orderSummaryRow" key={item._id}>
            <span className="orderItemName">{item.name}</span>
            <span>{item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="orderSummaryTotal">
        <span>Total</span>
        <strong>₹{cartTotal}</strong>
      </div>
    </div>
  );
}
