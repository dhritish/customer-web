import { useCallback, useState } from "react";
import { useAuth } from "../../contexts/authContext/authContext";
import { useRetry } from "../../contexts/retryLogic/autoRetry";
import type { PaymentType, PaymentPropsType } from "../Types";
import { PODCheckout, PPCheckout } from "../apiCalls";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";

const paymentOptions: { value: PaymentType; label: string }[] = [
  { value: "prePayment", label: "Online Payment" },
  { value: "payOnDelivery", label: "Pay on Delivery" },
];

export function Payment({ location }: PaymentPropsType) {
  const [paymentType, setPaymentType] = useState<PaymentType>("prePayment");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { autoRetry } = useRetry();
  const { isAccessLoaded } = useAuth();
  const { error, Razorpay } = useRazorpay();

  const handleCheckout = useCallback(async () => {
    if (!location) {
      setMessage("Please select a delivery location before checkout.");
      return;
    }
    setMessage(null);
    setIsCheckingOut(true);
    try {
      if (paymentType === "payOnDelivery") {
        const res = await autoRetry({ location }, PODCheckout);
        if (res.success) {
          setMessage("Checkout completed successfully.");
        } else {
          setMessage(res.error || "Checkout failed. Please try again.");
        }
        setIsCheckingOut(false);
      } else {
        const res = await autoRetry({ location }, PPCheckout);
        if (res.success) {
          const options: RazorpayOrderOptions = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: 5000,
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            order_id: res.orderId,
            timeout: 7 * 60,
            modal: {
              ondismiss: () => {
                setIsCheckingOut(false);
              },
            },
            handler: (response) => {
              console.log(response);
              setIsCheckingOut(false);
              setMessage("Payment completed successfully.");
            },
          };

          const rzp = new Razorpay(options);
          rzp.on("payment.failed", (response) => {
            console.log(response);
            setIsCheckingOut(false);
            setMessage(response.error.description || "Payment failed.");
          });
          rzp.open();
        } else {
          setIsCheckingOut(false);
          setMessage(res.error || "Checkout failed. Please try again.");
        }
      }
    } catch (error) {
      setIsCheckingOut(false);
      setMessage("Checkout failed. Please try again.");
    }
  }, [autoRetry, location, paymentType, Razorpay]);

  return (
    <div className="paymentSection">
      <div className="checkoutPanelHeader">
        <div>
          <span className="checkoutEyebrow">Payment</span>
          <h2>Choose payment type</h2>
        </div>
      </div>

      <div className="paymentBody">
        <div className="paymentOptions">
          {paymentOptions.map((option) => (
            <label
              className={`paymentOption ${
                paymentType === option.value ? "paymentOptionActive" : ""
              }`}
              key={option.value}
            >
              <input
                checked={paymentType === option.value}
                name="paymentType"
                onChange={() => setPaymentType(option.value)}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <button
          className="checkoutSubmitButton"
          disabled={!isAccessLoaded || !location || isCheckingOut}
          onClick={handleCheckout}
          type="button"
        >
          {isCheckingOut ? "Checking out..." : "Checkout"}
        </button>

        {error && <p className="checkoutMessage">Razorpay error: {error}</p>}
        {message && <p className="checkoutMessage">{message}</p>}
      </div>
    </div>
  );
}
