export const getDeliveredItemsAPI = async (params: any) => {
    const { accessToken } = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/order/delivered`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Client-Type': 'web'
            },
            credentials: 'include'
        }
    );
    return res.json();
}

export const getNotDeliveredItemsAPI = async (params: any) => {
    const { accessToken } = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/order/notDelivered`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Client-Type': 'web'
            },
            credentials: 'include'
        }
    );
    return res.json();
}

export const cancelOrderAPI = async (params: any) => {
    const { accessToken, _id, orderId} = params;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/order/cancel`,
    {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Client-Type': 'web'
        },
        credentials: 'include',
        body: JSON.stringify({
            _id,
            orderId
        })
    })
    return res.json();
}