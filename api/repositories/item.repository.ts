
import { ErroBancoDeDados } from '../../core/exceptions/erroBancoDeDados';
import { prisma as defaultDb } from '../../core/database/connection';
import { ItemEntityOutput, ItemEntity } from '../entities/item.entity';

export class ItemRepository {
    private db: typeof defaultDb;

    constructor(dbClient = defaultDb) {
        this.db = dbClient;
    }

    async criar(input: ItemEntity): Promise<ItemEntityOutput> {
        try {
            const { orderId, productId, quantity, price } = input
            const item = await this.db.item.create({
                data: {
                    orderId: orderId ?? '',
                    productId: productId as bigint,
                    quantity,
                    price
                }
            });
            return this.mapToEntity(item);
        } catch (e: any) {
            // será logado no handleError
            console.error(e);
            throw new ErroBancoDeDados("Erro de banco de dados ao criar Item");
        }
    }

    async listarTodos(id: string) {

    }

    async encontrarPorId(id: string): Promise<ItemEntityOutput | Object> {
        try {
            const item = await this.db.item.findMany({ where: { id } });
            return item ? this.mapToEntity(item) : {};
        }
        catch (e: any) {
            // será logado no handleError
            throw new ErroBancoDeDados("Erro de banco de dados ao encontrar Item");
        }
    }

    async atualizar(id: string, input: ItemEntity): Promise<ItemEntityOutput> {
        try {
            const item = await this.db.item.update({
                where: { id },
                data: input
            });
            return this.mapToEntity(item);
        }
        catch (e: any) {
            // será logado no handleError
            throw new ErroBancoDeDados("Erro de banco de dados ao atualizar Item");
        }
    }

    async removerTodos(id: string): Promise<void> {
        try {
            await this.db.item.deleteMany({ where: { orderId: id } });
        }
        catch (e: any) {
            // será logado no handleError
            throw new ErroBancoDeDados("Erro de banco de dados ao remover Order");
        }
    }

    // caso mude o ORM, ainda é possivel usar a entidade Item que é desacoplada da infraestrutura
    private mapToEntity(prismaItem: any): ItemEntityOutput {
        return {
            productId: prismaItem.productId,
            quantity: prismaItem.quantity,
            price: prismaItem.price
        };
    }
}

