import { PackageCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRetry } from "../../contexts/retryLogic/autoRetry";
import { getDeliveredItemsAPI } from "../apiCalls";
import type { OrderType } from "./Types";

export default function Delivered() {
  const [deliveredItems, setDeliveredItems] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { autoRetry } = useRetry();

  const fetchDeliveredItems = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await autoRetry({}, getDeliveredItemsAPI);
      if (res.success) {
        setDeliveredItems(res.deliveredItems ?? []);
      } else {
        setDeliveredItems([]);
        setErrorMessage(res.error ?? "Unable to load delivered items.");
      }
    } catch {
      setDeliveredItems([]);
      setErrorMessage("Unable to load delivered items.");
    } finally {
      setIsLoading(false);
    }
  }, [autoRetry]);

  useEffect(() => {
    fetchDeliveredItems();
  }, [fetchDeliveredItems]);

  const itemCount = deliveredItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (isLoading) {
    return (
      <section className="orderWindow">
        <div className="orderWindowHeader">
          <div>
            <h2>Delivered</h2>
            <span>Loading delivered items...</span>
          </div>
        </div>
        <div className="emptyOrders">
          <PackageCheck size={36} aria-hidden="true" />
          <h3>Checking your delivered items</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="orderWindow">
      <div className="orderWindowHeader">
        <div>
          <h2>Delivered</h2>
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {errorMessage ? (
        <div className="emptyOrders">
          <PackageCheck size={36} aria-hidden="true" />
          <h3>Could not load delivered items</h3>
          <p>{errorMessage}</p>
        </div>
      ) : deliveredItems.length === 0 ? (
        <div className="emptyOrders">
          <PackageCheck size={36} aria-hidden="true" />
          <h3>No delivered items yet</h3>
          <p>Your delivered orders will show up here.</p>
        </div>
      ) : (
        <div className="orderItemsList">
          {deliveredItems.map((item) => (
            <DeliveredItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function DeliveredItemCard({ item }: { item: OrderType }) {
  return (
    <article className="deliveredContainer">
      <div className="deliveredImageContainer">
        <img
          className="deliveredItemImage"
          src={
            item.url ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7H5SO_PbMIDuCocFhyTIbet6O18XKTpOrqY0QURzlCBm939T2hMG0eMc&s"
          }
          alt={item.name ?? "Product image"}
        />
      </div>
      <div className="deliveredItemInfo">
        <div className="deliveredTitleRow">
          <span className="deliveredItemName">{item.name}</span>
          <span className="deliveredStatus">{item.status ?? "Delivered"}</span>
        </div>
        <span className="deliveredItemPrice">₹{item.price}</span>
        <div className="deliveredMeta">
          <span>Quantity: {item.quantity}</span>
          <span>Total: ₹{item.price * item.quantity}</span>
          <span>{item.isDelivered ? "Delivered" : "In progress"}</span>
        </div>
      </div>
    </article>
  );
}
