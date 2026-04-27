import type { Dispatch, SetStateAction } from "react";

export type ProductType ={
    _id: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    url?: string;
}

export type CartContextType = {
    addToCart: (product: ProductType) => Promise<any>;
    cartItems: ProductType[];
    setCartItems: Dispatch<SetStateAction<ProductType[]>>;
    cartTotal: number;
    setCartTotal: Dispatch<SetStateAction<number>>;
    removeFromCart: (product: ProductType) => Promise<any>;
    decreaseFromCart: (product: ProductType) => Promise<any>;
}

export type useGetCartParams = {
    setCartItems: Dispatch<SetStateAction<ProductType[]>>;
    accessToken: string | null;
    setCartTotal: Dispatch<SetStateAction<number>>;
}