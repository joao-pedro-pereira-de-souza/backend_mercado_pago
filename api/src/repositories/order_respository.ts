import prisma, {PrismaTransactionalClient} from '@root/prisma/connection';
import {PrismaClient} from 'prisma/prisma-client';

export interface CreateOrder {
  status: 'approved' | 'rejected' | 'pending';
  id_user: string;
  amount: number;
  payment_method: string;
  id_product: string;
  id_product_been?: string;
  OrderDetails: {
    json_response_gateway: string;
  };
}

class OrderRepository {
    constructor(private prisma: PrismaClient | PrismaTransactionalClient) {}

    static getInstance() {
        return new OrderRepository(prisma);
    }

    transaction(trx: PrismaTransactionalClient) {
        return new OrderRepository(trx);
    }

    async create(data: CreateOrder) {
        const { OrderDetails, ...dataOrder } = data;
        return this.prisma.order.create({
            data: {
                ...dataOrder,
                OrderDetails: {
                    create: {
                        json_response_gateway: OrderDetails.json_response_gateway,
                    },
                },
            },
        });
    }
}

export default OrderRepository.getInstance();
