export type OrderType = {
    _id: string,
    orderId: string,
    name: string,
    price: number,
    quantity: number,
    stock: number,
    url?: string,
    status: string,
    isDelivered: boolean,
};