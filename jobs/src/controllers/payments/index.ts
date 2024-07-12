
import connection from '@configs/redis';
import configs from '@configs/bull_configs';
import PaymentsServices from '@services/payments_service';


export interface ParamsPayment {
  id_product: string;
  type_product: string;
  id_option_product: string;
  amount: number;
  id_client: string;
}

interface ParamsMain {
    data: ParamsPayment
}
async function main({ data }: ParamsMain) {
  return await PaymentsServices.payment(data);
}

export default {
    name: 'payments',
    async handle(data: any) {
        return await main(data);
    },
    connection,
    configs,
};
