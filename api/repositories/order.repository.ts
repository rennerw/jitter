
import { ErroBancoDeDados } from '../../core/exceptions/erroBancoDeDados';
import { prisma as defaultDb } from '../../core/database/connection';
import { OrderEntity } from '../entities/order.entity';

// repositorio pode usar qualquer cliente Prisma que implemente os mesmos métodos
export class OrderRepository {
    private db: typeof defaultDb;

    constructor(dbClient = defaultDb) {
        this.db = dbClient;
    }

    async criar(input: OrderEntity): Promise<OrderEntity> {
        try {
            const { orderId, value, creationDate } = input;
            const order = await this.db.order.create({
                data: {
                    orderId,
                    value,
                    creationDate,
                },
            });
            return this.mapToEntity(order);
        } catch (e: any) {
            // será logado no handleError
            console.error(e);
            if (e.code === 'P2002') throw e;
            throw new ErroBancoDeDados("Erro de banco de dados ao criar Order");
        }
    }

    async listarTodos(): Promise<OrderEntity[]> {
        const orders = await this.db.order.findMany({
            include: {
                items: true,
            },
        });
        // map não precisa ser await; deve retornar o valor de cada elemento
        const ordersMapped = orders.map(element => this.mapToEntity(element));
        return ordersMapped;
    }

    async encontrarPorId(id: string): Promise<OrderEntity | null> {
        const order = await this.db.order.findUnique(
            {
                where: { orderId: id },
                include: { items: true }
            },

        );
        return order ? this.mapToEntity(order) : null;
    }

    async atualizar(id: string, input: OrderEntity): Promise<OrderEntity> {
        try {
            const { orderId, value, creationDate } = input;
            const order = await this.db.order.update({
                where: { orderId: id },
                data: {
                    orderId,
                    value,
                    creationDate,
                }
            });
            return this.mapToEntity(order);
        }
        catch (e: any) {
            // será logado no handleError
            throw new ErroBancoDeDados("Erro de banco de dados ao atualizar Order");
        }
    }

    async remover(id: string): Promise<void> {
        console.error(id);
        try {
            await this.db.order.delete(
                {
                    where:
                        { orderId: id }
                }
            );
        }
        catch (e: any) {
            throw new ErroBancoDeDados("Erro de banco de dados ao remover Order");
        }
    }

    // caso mude o ORM, ainda é possivel usar a entidade Order que é desacoplada da infraestrutura
    private mapToEntity(prismaOrder: any): OrderEntity {
        prismaOrder.items?.forEach((element: any) => {
            element.productId = Number(element.productId);
        });
        return {
            orderId: prismaOrder.orderId,
            value: prismaOrder.value,
            creationDate: prismaOrder.creationDate,
            items: prismaOrder.items || [],
        };
    }
}

