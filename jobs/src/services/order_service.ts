
import ordersRepository, {ParamsValueOrderPending} from "@repositories/orders.repository";
import { typesProducts } from '@contents/products';

interface ParamsGetTotalOrdersPending {
  id_product: string;
  id_option_product?: string;
}
class OrderService {

  async getTotalOrdersPending(params: ParamsGetTotalOrdersPending) {
    const { id_product, id_option_product } = params;

    const orders = await ordersRepository.getOrdersPending(
      id_product,
      id_option_product
    );

    let totalAmount = 0
    for await (let order of orders) {
      if (order) {
        const parse = JSON.parse(order) as ParamsValueOrderPending;
        totalAmount += parse.amount;
      }

    }

    return totalAmount;
  }
}


export default new OrderService();
