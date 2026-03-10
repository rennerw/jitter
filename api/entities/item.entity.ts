export interface ItemEntity {
    orderId: string
    productId: bigint | number
    quantity: number
    price: number
}

export interface ItemEntityOutput {
    productId: bigint | number
    quantity: number
    price: number
}