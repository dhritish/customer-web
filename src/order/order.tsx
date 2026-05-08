import Delivered from "./components/delivered";
import NotDelivered from "./components/notDelivered";
import "./order.css";

export default function Order() {
  return (
    <main className="orderPage">
      <div className="orderPageHeader">
        <div>
          <span className="orderEyebrow">Your orders</span>
          <h1>Order history</h1>
        </div>
      </div>
      <div className="orderSections">
        <NotDelivered />
        <Delivered />
      </div>
    </main>
  );
}
