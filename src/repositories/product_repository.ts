import prisma from '@root/prisma/connection';
import { Product , ProductBee} from '@prisma/client';


interface ProductBeeInterface extends Product {
    options: ProductBee[]
}

class UserRepository {

    async findManyProductsNotIntegratedMercadopago(): Promise<Product[]> {
        return prisma.product.findMany({
            where: {
                deleted_at: null,
                id_item_mercado_pago: null
            }
        });
    }

    async findFirstProductType(type: string): Promise<ProductBeeInterface | null > {
        return prisma.product.findFirst({
            where: { type, deleted_at: null },
            include: {
                options: true
            }
        });
    }
}


export default new UserRepository();
