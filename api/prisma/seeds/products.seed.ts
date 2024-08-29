import products from './contents/products.json';
import { PrismaTransactionalClient } from '../connection';
export class ProductsSeed {
    #prisma;
    constructor(prisma: PrismaTransactionalClient) {
        this.#prisma = prisma;
    }

    async #create() {
        const productBee = products.find((item) => item.type === 'product_bee');

        const isProductExists = await this.#prisma.product.findFirst({
            where: { type: 'product_bee', deleted_at: null },
            include: {
                options: true,
            },
        });

        if (productBee && !isProductExists) {
            await this.#prisma.product.create({
                data: {
                    type: productBee.type,
                    options: {
                        createMany: {
                            data: productBee.options,
                        },
                    },
                },
            });
        }
    }

    async inicialize() {
        await this.#create();
    }
}
