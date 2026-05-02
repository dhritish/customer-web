import { ItemInfo } from "./components/itemInfo";
import MapWithGPS from "./components/map";
import { Payment } from "./components/payment";
import "./checkout.css";
import { useState } from "react";

export default function Checkout() {
  const [location, setLocation] = useState<[number, number] | null>(null);

  return (
    <main className="checkoutPage">
      <section className="checkoutHeader">
        <div>
          <span className="checkoutEyebrow">Checkout</span>
          <h1>Review your order</h1>
        </div>
      </section>

      <section className="checkoutLayout">
        <div className="checkoutStack">
          <div className="checkoutPanel">
            <ItemInfo />
          </div>
        </div>

        <div className="checkoutStack">
          <div className="checkoutPanel checkoutMapPanel">
            <div className="checkoutPanelHeader">
              <div>
                <span className="checkoutEyebrow">Delivery location</span>
                <h2>Choose address on map</h2>
              </div>
            </div>
            <div className="checkoutMapFrame">
              <MapWithGPS location={location} setLocation={setLocation} />
            </div>
          </div>

          <div className="checkoutPanel">
            <Payment location={location} />
          </div>
        </div>
      </section>
    </main>
  );
}
