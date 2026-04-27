import { useEffect } from "react";
import { getCart } from "./apiCalls";
import type { ProductType, useGetCartParams } from "./Types";

export function useGetCart(params: useGetCartParams){
    const {setCartItems, setCartTotal, accessToken} = params;
    useEffect(()=>{
        (async () => {
        const res = await getCart({accessToken});
        if(res.success === false){
            return;
        }
        setCartItems(res.cart);
        const total = res.cart.reduce((acc: number, item: ProductType) =>{return acc+(item.price*item.quantity);},0);
        console.log(`total: ${total}`);
        setCartTotal(total);
    })();
    },[accessToken]);
}