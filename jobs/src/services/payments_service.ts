
import { DefaultResponseParams } from '@interfaces/resposes';
import productsRepository from "@repositories/products.repository";
import ordersRepository from "@repositories/orders.repository";
import { ParamsPayment } from '../process/payments';
import productsService from './products.service';
import logger from '../configs/logger';

// interface ParamsCreatePreferences {
//   id: string;
//   title: string;
//   amount: number;
//   value: number;
//   description: string;
//   image: string;
//   client: {
//     email: string;
//     name: string;
//     cpf: string;
//   };
//   expiration_from: string;
//   expiration_to: string;
// }

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

    const responseOrderPending = await ordersRepository.addOrderPending(
      detailsOrderPending,
      paramsOrder.amount
    );

    if (!responseOrderPending.success) {
      logger.error({ data: responseOrderPending });
      return responseOrderPending;
    }

    return {
      success: true,
      data: product,
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
