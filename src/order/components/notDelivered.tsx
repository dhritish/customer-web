import { PackageSearch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRetry } from "../../contexts/retryLogic/autoRetry";
import { cancelOrderAPI, getNotDeliveredItemsAPI } from "../apiCalls";
import type { OrderType } from "./Types";

export default function NotDelivered() {
  const [notDeliveredItems, setNotDeliveredItems] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { autoRetry } = useRetry();

  const fetchNotDeliveredItems = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await autoRetry({}, getNotDeliveredItemsAPI);
      if (res.success) {
        setNotDeliveredItems(res.orderedItems ?? []);
      } else {
        setNotDeliveredItems([]);
        setErrorMessage(res.error ?? "Unable to load pending items.");
      }
    } catch {
      setNotDeliveredItems([]);
      setErrorMessage("Unable to load pending items.");
    } finally {
      setIsLoading(false);
    }
  }, [autoRetry]);

  const handleCancelOrder = useCallback(
    async (orderId: string, _id: string) => {
      try {
        setCancelingOrderId(_id);
        const res = await autoRetry({ orderId, _id }, cancelOrderAPI);
        if (res.success) {
          await fetchNotDeliveredItems();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setCancelingOrderId(null);
      }
    },
    [autoRetry, fetchNotDeliveredItems],
  );

  useEffect(() => {
    fetchNotDeliveredItems();
  }, [fetchNotDeliveredItems]);

  const itemCount = notDeliveredItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (isLoading) {
    return (
      <section className="orderWindow">
        <div className="orderWindowHeader">
          <div>
            <h2>Not delivered</h2>
            <span>Loading pending items...</span>
          </div>
        </div>
        <div className="emptyOrders">
          <PackageSearch size={36} aria-hidden="true" />
          <h3>Checking your pending items</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="orderWindow">
      <div className="orderWindowHeader">
        <div>
          <h2>Not delivered</h2>
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {errorMessage ? (
        <div className="emptyOrders">
          <PackageSearch size={36} aria-hidden="true" />
          <h3>Could not load pending items</h3>
          <p>{errorMessage}</p>
        </div>
      ) : notDeliveredItems.length === 0 ? (
        <div className="emptyOrders">
          <PackageSearch size={36} aria-hidden="true" />
          <h3>No pending items</h3>
          <p>Orders that are still on the way will show up here.</p>
        </div>
      ) : (
        <div className="orderItemsList">
          {notDeliveredItems.map((item) => (
            <NotDeliveredItemCard
              key={item._id}
              item={item}
              isCanceling={cancelingOrderId === item._id}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function NotDeliveredItemCard({
  item,
  isCanceling,
  onCancel,
}: {
  item: OrderType;
  isCanceling: boolean;
  onCancel: (orderId: string, _id: string) => void;
}) {
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
          <span className="deliveredStatus pendingStatus">
            {item.status ?? "Pending"}
          </span>
        </div>
        <span className="deliveredItemPrice">₹{item.price}</span>
        <div className="deliveredMeta">
          <span>Quantity: {item.quantity}</span>
          <span>Total: ₹{item.price * item.quantity}</span>
          <span>{item.isDelivered ? "Delivered" : "In progress"}</span>
        </div>
        <div className="notDeliveredActions">
          <button
            className="cancelOrderButton"
            disabled={isCanceling}
            type="button"
            onClick={() => onCancel(item.orderId, item._id)}
          >
            {isCanceling ? "Canceling..." : "Cancel order"}
          </button>
        </div>
      </div>
    </article>
  );
}
