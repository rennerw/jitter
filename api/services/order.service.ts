import { OrderRepository } from '../repositories/order.repository';
import { prisma } from '../../core/database/connection';

import CreateOrderInput from '../dto/order/createOrderInput.dto';

import { ItemRepository } from '../repositories/item.repository';
import { validateRequest } from '../../core/http/custom-request';
import { OrderEntity } from '../entities/order.entity';
import { ItemEntity } from '../entities/item.entity';
import { ErroBancoDeDados } from '../../core/exceptions/erroBancoDeDados';
import UpdateOrderInput from '../dto/order/updateOrderInput.dto';

// Aqui optei por deixar em portugues por se tratar de algo relacionado 
// a regras de negócio e menos padronizado que os metodos de controller
export class OrderService {
    private readonly orderRepository = new OrderRepository();
    private readonly itemRepository = new ItemRepository();

    constructor() {
        return this;
    }

    async criar(input: CreateOrderInput) {
        // lógica de validação ou regras de negócio
        await validateRequest(CreateOrderInput, input);

        const orderEntity: OrderEntity = {
            orderId: input.numeroPedido.split("-")[0],
            value: input.valorTotal,
            creationDate: input.dataCriacao,
        };

        // transação abrange criação de pedido com itens e só commita se os dois funcionarem
        // para garantir o rollback precisa da instancia tx
        try {
            const createdOrder = await prisma.$transaction(async (tx: any) => {
                const orderTransactionRepo = new OrderRepository(tx);
                const itemTransactionRepo = new ItemRepository(tx);
                const savedOrder = await orderTransactionRepo.criar(orderEntity);

                for (const itemInput of input.items) {
                    const item: ItemEntity = {
                        orderId: savedOrder.orderId,
                        price: itemInput.valorItem,
                        quantity: itemInput.quantidadeItem,
                        productId: itemInput.idItem,
                    };
                    await itemTransactionRepo.criar(item);
                }

                return savedOrder;
            });

            return this.orderRepository.encontrarPorId(createdOrder.orderId);
        }
        catch (e: any) {
            // será logado no handleError
            if (e?.code === 'P2002') throw new ErroBancoDeDados("Chave única se repetindo ao criar Order")
            throw new ErroBancoDeDados("Erro de banco de dados ao criar Order e Itens")
        }

    }

    async listarTodos() {
        // pode aplicar filtros ou paginação
        return this.orderRepository.listarTodos();
    }

    async encontrarPorId(id: string) {
        // pode lançar erro se não encontrar
        try {
            return this.orderRepository.encontrarPorId(id);
        }
        catch (e: any) {
            throw new Error("Erro inesperado no servidor")
        }
    }

    async atualizar(orderId: string, input: UpdateOrderInput) {
        await validateRequest(CreateOrderInput, input);

        const orderEntity: OrderEntity = {
            orderId: input.numeroPedido.split("-")[0],
            value: input.valorTotal,
            creationDate: input.dataCriacao,
        };

        try {
            const createdOrder = await prisma.$transaction(async (tx: any) => {
                const orderTransactionRepo = new OrderRepository(tx);
                const itemTransactionRepo = new ItemRepository(tx);
                const updatedOrder = await orderTransactionRepo.atualizar(orderId, orderEntity);

                // se a ideia for fazer um historico, a melhor coisa é fazer um upsert com exclusao logica
                // fiz dessa forma pq nao sei qual a ideia central e é garantido
                itemTransactionRepo.removerTodos(orderId);

                for (const itemInput of input.items) {
                    const item: ItemEntity = {
                        orderId: updatedOrder.orderId,
                        price: itemInput.valorItem,
                        quantity: itemInput.quantidadeItem,
                        productId: itemInput.idItem,
                    };
                    await itemTransactionRepo.criar(item);
                }

                return updatedOrder;
            });

            return this.orderRepository.encontrarPorId(createdOrder.orderId);
        }
        catch (e: any) {
            // será logado no handleError
            if (e?.code === 'P2002') throw new ErroBancoDeDados("Chave única se repetindo ao criar Order")
            throw new ErroBancoDeDados("Erro de banco de dados ao criar Order e Itens")
        }
    }

    async remover(id: string) {
        // pode verificar dependências antes de remover
        console.log(" id ---------> ", id)
        try {
            return this.orderRepository.remover(id);
        }
        catch (e) {
            // será logado no handleError
            throw e;
        }
    }
}

