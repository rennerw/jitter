import { ItemEntity } from './item.entity'

export interface OrderEntity {
    orderId: string
    value: number
    creationDate: string
    items?: ItemEntity[] | null
}

export interface PaginatedOrderEntity<T> {
    data: T[] | null
    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    };
}