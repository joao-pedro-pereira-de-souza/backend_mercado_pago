import zod from 'zod';
import { typesProducts} from '@contents/products';

export const paymentSchema = zod.object({
    id_product: zod.string().optional(),
    type_product: zod.enum([typesProducts.bee]),
    id_option_product: zod.string().optional(),
    amount: zod.number(),
    // name: zod.string(),
    // email: zod.string().email(),
    // cpf: zod.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/),
});



export type typePaymentSchema = zod.infer<typeof paymentSchema>;
