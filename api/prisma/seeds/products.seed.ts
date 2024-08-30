import products from './contents/products.json';
import { PrismaTransactionalClient } from '../connection';

import { typesProducts } from '../../src/contents/products';

export class ProductsSeed {
    #prisma;
    constructor(prisma: PrismaTransactionalClient) {
        this.#prisma = prisma;
    }

    async #createProductBee() {
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
                            data: productBee.options as any[],
                        },
                    },
                },
            });
        }
    }

    async #createProductHoneyPot() {
        const productHoneyPot = products.find((item) => item.type === 'product_honey_pot');
        const { value_ml, minimum_ml, maximum_ml, ...dataProduct } =
            productHoneyPot as any;

        await this.#prisma.product.create({
            data: {
                ...dataProduct,
                payments_ml: {
                    create: {
                        value_ml,
                        minimum_ml,
                        maximum_ml,
                    },
                },
            },
        });
    }

    async #createProductHive() {
        const productHive = products.find(
            (item) => item.type === typesProducts.hive
        ) as any;


        await this.#prisma.product.create({
            data: {
                ...productHive

            },
        });
    }

    async inicialize() {
        await this.#createProductBee();
        await this.#createProductHoneyPot();
        await this.#createProductHive();
    }
}
