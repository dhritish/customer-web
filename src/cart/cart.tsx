import { ShoppingCart } from "./components/shoppingCart";
import "./cart.css";

export default function Cart() {
  return (
    <main className="cartPage">
      <div className="cartPageHeader">
        <div>
          <span className="cartEyebrow">Shopping cart</span>
          <h1>Your cart</h1>
        </div>
      </div>

      <div className="cartPageGrid">
        <ShoppingCart />
        {/* Reserved for a future bought / buy again section. */}
      </div>
    </main>
  );
}
