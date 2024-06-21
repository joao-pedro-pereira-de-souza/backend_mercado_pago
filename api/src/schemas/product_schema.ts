import zod from 'zod';
import { typesProducts} from '@contents/products';

export const paymentSchema = zod.object({
    id_product: zod.string().optional(),
    type_product: zod.enum([typesProducts.bee]),
    id_option_product: zod.string().optional(),
    amount: zod.number(),
});



export type typePaymentSchema = zod.infer<typeof paymentSchema>;
