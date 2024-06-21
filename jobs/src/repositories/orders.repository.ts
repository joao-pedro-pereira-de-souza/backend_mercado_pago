import redisService from "@services/redis_service";
import { randomUUID } from "crypto";
import { mercadopagoConfigs } from "@configs/mercadopago";
import { DefaultResponseParams } from '@interfaces/resposes';

interface DetailsOrderPending {
  id_product: string;
  type_product: string;
  id_option_product?: string;
}

export interface ParamsValueOrderPending {
  id_product: string;
  amount: number;
  id_order: string;
  type_product: string;
  id_option_product?: string;
}

class OrderRepository {
  public key_order = (id_product: string, id_option_product?: string) =>
    id_option_product
      ? `order@${id_product}@option=${id_option_product}`
      : `order@${id_product}`;

  async addOrderPending(
    data: DetailsOrderPending,
    amount: number
  ): Promise<DefaultResponseParams> {


    try {
      const { id_product, type_product, id_option_product } = data;

      const dataCache: ParamsValueOrderPending = {
        id_product,
        amount,
        id_order: randomUUID({ disableEntropyCache: true }),
        type_product,
        id_option_product,
      };

      let keySet = this.key_order(id_product, id_option_product);
      keySet += `:${dataCache.id_order}`;

      const responseRedis = await redisService.client?.set(keySet, JSON.stringify(dataCache), {
        EX: 60000 * mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES,
      });

      return {
        success: true,
        data: responseRedis,
      };

    } catch (error) {

      return {
        success: false,
        message: 'Ocorreu um erro ao salvar o pedido pendente.',
        error
      }

    }

  }

  async getOrdersPending(id_product: string, id_option_product?: string) {
    const keys = await redisService.client?.keys(
      `${this.key_order(id_product, id_option_product)}*`
    );

    if (!keys || keys.length === 0) {
      return [];
    }
    const results = await redisService.client?.mGet(keys);
    return results || [];
  }
}

export default new OrderRepository();
