
import { DefaultResponseParams } from '@interfaces/resposes';
import productsRepository from "@repositories/products.repository";
import orderRepository from "@repositories/orders.repository";
import clientRepository from "@repositories/clients.repository";

import { ParamsPayment } from '../controllers/payments';
import productsService from './products.service';

import mercadopagoService from '@services/gateway/mercadopago';
import { ParamsCreatePreferences } from '@services/gateway/mercadopago/preferences';

import logger from '../configs/logger';
import {typesProducts} from '@contents/products';

async function payment(
  params: ParamsPayment
): Promise<DefaultResponseParams> {
  try {

    const [product] = await productsRepository.findOptionProductBee(params.id_option_product, params.id_product);
    const paramsOrder = {
        amount: params.amount,
        id_product: params.id_product,
    };

    const responseOrderServiceValidation = await productsService.validationOrder(product, paramsOrder);
    if (!responseOrderServiceValidation.success) {
      logger.error({ data: responseOrderServiceValidation });
      return responseOrderServiceValidation;
    }

    const detailsOrderPending = {
      id_product: params.id_product,
      type_product: params.type_product,
      id_option_product: params.id_option_product,
    };

    const responseOrderPending = await orderRepository.addOrderPending(
      detailsOrderPending,
      paramsOrder.amount
    );
    if (!responseOrderPending.success) {
      logger.error({ data: responseOrderPending });
      return responseOrderPending;
    }
    const key_order_pending = responseOrderPending.data!.key;

    const client = await clientRepository.findClient(params.id_client);
    if (!client) {
      const respose = {
        success: false,
        message: 'Usuário não encontrado.'
      }

      return respose;
    }

    const { expiration } = responseOrderPending.data!;
    const value_product = product.type === typesProducts.bee ? product.option.value : product.value;
    const paramsCreateMercadoPago: ParamsCreatePreferences = {
      title: product.title,
      image: product.image,
      description: product.description,
      id: product.id,
      amount: params.amount,
      value: value_product,
      client: {
        name: client.name,
        cpf: client.cpf,
        email: client.email,
      },
      expiration_from: expiration.start,
      expiration_to: expiration.end,
    };
    const resposePreferenceMercadoPago = await mercadopagoService.preference.create(paramsCreateMercadoPago);

    return {
      success: true,
      data: {
        preference: resposePreferenceMercadoPago,
        key_order: key_order_pending,
      },
    };

  } catch (error) {

    const response = {
      success: false,
      message: "Ocorreu um erro no processo de pagamento.",
      error,
    };
    logger.error({ data: response });
    return response;
  }
}

export default {
  payment,
};
