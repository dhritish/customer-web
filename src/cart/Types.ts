import type { ProductType } from "../contexts/cartContext/Types"

export type CartItemPropsType = {
    cartItem: ProductType;
    handleRemoveFromCart: (product: ProductType) => Promise<any>;
    handleDecreaseFromCart: (product: ProductType) => Promise<any>;
    handleAddToCart: (product: ProductType) => Promise<any>;
}

export type PaymentType = "payOnDelivery" | "prePayment";

export type PaymentPropsType = {
  location: [number, number] | null;
};