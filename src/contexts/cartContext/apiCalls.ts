export async function addToCart(params: any) {
    const {accessToken, product} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/addToCart`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Client-Type": "web",
            },
            method: "PATCH",
            body: JSON.stringify(product),
            credentials: "include",
        }
    )
    return res.json();
}

export async function decreaseQuantity(params: any){
    const {accessToken, product} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/decreaseFromCart`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Client-Type": "web",
            },
            method: "PATCH",
            body: JSON.stringify(product),
            credentials: "include",
        }
    )
    return res.json();
}

export async function removeFromCart(params: any) {
    const {accessToken, product} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/removeFromCart`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Client-Type": "web",
            },
            method: "PATCH",
            body: JSON.stringify(product),
            credentials: "include",
        }
    )
    return res.json();
}

export async function getCart(params: any) {
    const {accessToken} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/getCart`,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Client-Type": "web",
        },
        method: "GET",
        credentials: "include",
    });
    return res.json();
}
