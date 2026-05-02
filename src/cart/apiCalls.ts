export async function PODCheckout(params: any){
    const {accessToken, location} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/checkout/payOnDelivery`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Client-Type": "web",
            },
            credentials: "include",
            body: JSON.stringify({location}),
        }
    );
    return await res.json();
}

export async function PPCheckout(params: any){
    const {accessToken, location} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/checkout/prePayment`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Client-Type": "web",
            },
            credentials: "include",
            body: JSON.stringify({location}),
        }
    );
    return await res.json();
}