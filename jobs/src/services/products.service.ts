import { QueryFindOptionProductBeeInterface } from "@repositories/products.repository";
import { typesProducts } from "@contents/products";
import { DefaultResponseParams } from "@interfaces/resposes";
import orderService from "@services/order_service";

interface ParamsOrder {
  amount: number;
  id_product: string;
}

interface ParamsValidationProductTypeBee
  extends Pick<QueryFindOptionProductBeeInterface, "option"> {
  order: ParamsOrder;
}

class ProductsServices {
  async #validationProductTypeBee(
    params: ParamsValidationProductTypeBee
  ): Promise<DefaultResponseParams> {
    const { option, order } = params;

    const paramsTotalOrderPending = {
      id_product: option.id_product,
      id_option_product: option.id,
    };
    const resposeTotalOrderPending = await orderService.getTotalOrdersPending(
      paramsTotalOrderPending
    );

    const totalAmountAvailable = option.amount - resposeTotalOrderPending;
    if (totalAmountAvailable < order.amount) {
      let message = "O seu pedido cedeu a quantidade de produto disponível.";
      if (option.amount > order.amount) message = "Produto indisponível devido a pedidos pendentes.";

      const response = {
        success: false,
        message,
        error: new Error(message),
      };
      return response;
    }

    return {
      success: true,
    };
  }

  async validationOrder(
    product: QueryFindOptionProductBeeInterface,
    order: ParamsOrder
  ): Promise<DefaultResponseParams> {

    if (!product) {
      const response = {
        success: false,
        message: "Produto não encontrado",
        error: new Error("Produto não encontrado"),
      };
      return response;
    }

    if (product.type === typesProducts.bee) {
      const { option } = product;
      return await this.#validationProductTypeBee({ option, order });
    }

    return {
      success: true,
    };
  }
}

export default new ProductsServices();
