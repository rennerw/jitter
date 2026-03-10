import { OrderService } from "../services/order.service";

export default class OrderController {
    private static orderService = new OrderService();
    constructor() { }

    static async get(id: string): Promise<any> {

        try {
            const result = this.orderService.encontrarPorId(id);
            return result;
        }
        catch (e: any) {
            throw e;
        }
    }

    static async list(request: any): Promise<any> {
        try {
            const result = this.orderService.listarTodos();
            return result;
        }
        catch (e: any) {
            throw e;
        }
    }

    static async create(request: any): Promise<any> {
        try {
            const result = this.orderService.criar(request)
            return result;
        }
        catch (e: any) {
            throw e;
        }
    }

    static async update(id: string, request: any): Promise<any> {
        try {
            const result = this.orderService.atualizar(id, request)
            return result;
        }
        catch (e: any) {
            throw e;
        }
    }

    static async delete(id: string): Promise<any> {
        try {
            await this.orderService.remover(id)
            return `Removido ${id}`;
        }
        catch (e: any) {
            throw e;
        }
    }

}