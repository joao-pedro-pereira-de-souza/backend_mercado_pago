import prisma from '@root/prisma/connection';
import { typesProducts } from '@contents/products';


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

    async findAllGroupedByType() {

        const responseQuery = await prisma.$queryRaw`
         SELECT p.*,
                ARRAY(
                     SELECT jsonb_build_object(
                'id', pb.id,
                'title', pb.title,
                'description', pb.description,
                'image', pb.image,
                'amount', pb.amount,
                'value', pb.value
            )
            FROM products_bee AS pb
            WHERE pb.id_product = p.id
                ) AS options,
            phpt.value_ml,
            phpt.minimum_ml,
            phpt.maximum_ml
            FROM products AS p
            LEFT JOIN products_honey_pot AS phpt ON phpt.id_product = p.id
        ` as any[];

        if (!responseQuery) return [];

        const formatObject: any = {};

        responseQuery.forEach((product) => {

            switch (product.type) {
            case typesProducts.bee:
                formatObject[product.type] = {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    type: product.type,
                    options: product.options,
                };
                break;

            case typesProducts.honey_pot:
                formatObject[product.type] = {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    type: product.type,
                    image: product.image,
                    value: product.value,
                    value_ml: product.value_ml,
                    minimum_ml: product.minimum_ml,
                    maximum_ml: product.maximum_ml,
                };
                break;

            case typesProducts.hive:
                formatObject[product.type] = {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    type: product.type,
                    image: product.image,
                    value: product.value,

                };
                break;
            default:
                formatObject[product.type] = { ...product };
                break;
            }

        });

        return formatObject;
    }

    async findProductOrProductOption(id: string) {
        const product = await prisma.product.findFirst({
            where: {
                id,
            },
        });

        if (product) {
            return product;
        }

        const product_option = await prisma.productBee.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                id_product: true,
                product: { select: { type: true } }
            }
        });
        return product_option;
    }
}


export default new ProductRepository();
