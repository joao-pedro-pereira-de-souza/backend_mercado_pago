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

interface ResposeAddOrderPending extends DefaultResponseParams {
  data?: {
    redis: string | null;
    key: string;
    expiration: {
      start: string;
      end: string
    }
  };
}

class OrderRepository {
  public key_order = (id_product: string, id_option_product?: string) =>
    id_option_product
      ? `order@${id_product}@option=${id_option_product}`
      : `order@${id_product}`;

  async addOrderPending(
    data: DetailsOrderPending,
    amount: number
  ): Promise<ResposeAddOrderPending> {
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

      const responseRedis = await redisService.client.set(
        keySet,
        JSON.stringify(dataCache),
        {
          EX: 60000 * mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES,
        }
      );

      const now = new Date();
      const end = new Date(
        now.getTime() +
          mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES * 60 * 1000
      );
      return {
        success: true,
        data: {
          redis: responseRedis,
          key: keySet,
          expiration: {
            start: now.toISOString(),
            end: end.toISOString(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Ocorreu um erro ao salvar o pedido pendente.",
        error,
      };
    }
  }

  async getOrdersPending(
    id_product: string,
    id_option_product?: string
  ): Promise<any[]> {
    const keys = await redisService.client?.keys(
      `${this.key_order(id_product, id_option_product)}*`
    );

    if (!keys || keys.length === 0) {
      return [];
    }
    const results = await redisService.client?.mGet(keys);

    return results;
  }

  async deleteOrderPending(key_order_pending: string): Promise<void> {
    await redisService.client?.del(key_order_pending);
  }
}

export default new OrderRepository();
