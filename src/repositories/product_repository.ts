import prisma from '@root/prisma/connection';
import { Product , ProductBee} from '@prisma/client';
import { typesProducts } from '@contents/products';

interface ProductBeeInterface extends Product {
    options: ProductBee[]
}

interface QueryFindOptionProductBeeInterface {
  id: string;
  title: any;
  description: any;
  type: string;
  image: any;
  value: any;
  id_item_mercado_pago: any;
  deleted_at: any;
  option: {
    id: string;
    image: string;
    title: string;
    value: number;
    amount: number;
    id_product: string;
    description: string;
  };
}
class ProductRepository {
    async findManyProductsNotIntegratedMercadopago(): Promise<Product[]> {
        return prisma.product.findMany({
            where: {
                deleted_at: null,
                id_item_mercado_pago: null,
            },
        });
    }

    async findFirstProductType(
        type: string
    ): Promise<ProductBeeInterface | null> {
        return prisma.product.findFirst({
            where: { type, deleted_at: null },
            include: {
                options: true,
            },
        });
    }

    async findOptionProductBee(
        id_option: string
    ): Promise<QueryFindOptionProductBeeInterface[]> {
        const query = prisma.$queryRaw<QueryFindOptionProductBeeInterface[]>`
            SELECT p.*,
            jsonb_build_object(
                'id', sub_select.id,
                'title', sub_select.title,
                'description', sub_select.description,
                'image', sub_select.image,
                'amount', sub_select.amount,
                'value', sub_select.value,
                'id_product', sub_select.id_product

            ) AS option
            FROM products AS p
            INNER JOIN LATERAL (
                SELECT op.*
                FROM products_bee AS op
                WHERE op.id_product = p.id
                LIMIT 1
            ) AS sub_select ON true
            WHERE p.type = ${typesProducts.bee}
            AND p.deleted_at IS NULL
            AND sub_select.id = ${id_option}
            LIMIT 1
        `;

        return await query;
    }
}


export default new ProductRepository();
