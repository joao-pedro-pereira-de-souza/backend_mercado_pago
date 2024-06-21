import database from "../database/connection";
import { typesProducts } from "@contents/products";

export interface QueryFindOptionProductBeeInterface {
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
    id_option: string,
    id_product: string,
  ): Promise<QueryFindOptionProductBeeInterface[]> {

     return (
       await database.raw(`
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
                AND op.id = '${id_option}'
                LIMIT 1
            ) AS sub_select ON true
            WHERE p.type = '${typesProducts.bee}'
            AND p.deleted_at IS NULL
            AND p.id = '${id_product}'
            LIMIT 1
     `)
     ).rows as QueryFindOptionProductBeeInterface[];
  }
}

export default new ProductRepository();
