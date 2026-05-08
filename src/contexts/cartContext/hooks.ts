import { useEffect } from "react";
import { getCart } from "./apiCalls";
import type { ProductType, useGetCartParams } from "./Types";

export function useGetCart(params: useGetCartParams){
    const {setCartItems, setCartTotal, autoRetry, isAccessLoaded} = params;
    useEffect(()=>{
        (async () => {
        if(!isAccessLoaded){
            return;
        };
        const res = await autoRetry({}, getCart);
        if(res.success === false){
            return;
        }
        setCartItems(res.cart);
        console.log(res.cart);
        const total = res.cart.reduce((acc: number, item: ProductType) =>{return acc+(item.price*item.quantity);},0);
        setCartTotal(total);
    })();
    },[isAccessLoaded, autoRetry, setCartItems, setCartTotal]);
}