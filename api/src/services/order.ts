
import UserRepository from '@repositories/user_repository';
import LogPaymentRepository from '@repositories/logs_payments_repository';
import ProductRepository from '@repositories/product_repository';
import OrderRepository from '@repositories/order_respository';
import prisma from '@root/prisma/connection';
import { Response as ResponseMercadoPago } from '@interfaces/mercadopago/get.payment';

interface OrderServiceDto {
   save(data: ResponseMercadoPago): Promise<void>;
}

export class OrderService implements OrderServiceDto {
    constructor() {}

    #getObjectExternalReference(external_reference: string) {

        const [idUserTemplate, keyTemplate] = external_reference.split('@');


        return {
            id_user: idUserTemplate.split(':')[1],
            key: keyTemplate.split(':')[1],
        };
    }
    async save(data: ResponseMercadoPago): Promise<void> {
        console.log('========================= save ======================');
        console.log('========================= 1 ======================');

        const { id_user } = this.#getObjectExternalReference(
            data.external_reference
        );

        console.log('========================= 2 ======================');


        const user = await UserRepository.getById(id_user);
        if (!user) {
            await LogPaymentRepository.create({
                message: 'Usuário não entrado',
                status: 'rejected',

            });

            return;
        }
        console.log('========================= 3 ======================');


        const product: any = await ProductRepository.findProductOrProductOption(
            data.additional_info.items[0].id
        );
        console.log('========================= 4 ======================');


        if (!product) {
            await LogPaymentRepository.create({
                message: 'Usuário não entrado',
                status: 'rejected',
            });
            return;
        }
        console.log('========================= 5 ======================');

        const getObjectProduct = () => {
            if (product?.type && product.type === 'product_bee') {
                return {
                    id_product: product.id,
                };
            }

            return {
                id_product: product.id_product,
                id_product_been: product.id
            };
        };
        const item = data.additional_info.items[0];
        const productDetails = getObjectProduct();
        console.log('========================= 6 ======================');


        const amountOrder = Number(item.quantity);

        console.log({amountOrder});
        await prisma.$transaction(async (trx) => {
            await OrderRepository.transaction(trx).create({
                amount: amountOrder,
                id_user,
                payment_method: data.payment_method.type,
                status: data.status as any,
                ...productDetails,
                OrderDetails: {
                    json_response_gateway: JSON.stringify(data),
                },
            });


        });
        console.log('========================= 7 ======================');


        // await OrderRepository.create({
        //     amount: amountOrder,
        //     id_user,
        //     payment_method: data.payment_method.type,
        //     status: data.status as any,
        //     ...productDetails,
        //     OrderDetails: {
        //         json_response_gateway: JSON.stringify(data),
        //     },
        // });

    }
}
export default new OrderService();
