import { Request, Response, NextFunction } from 'express';

import jobs from '@jobs/index';

import { paymentSchema, typePaymentSchema } from '@schemas/product_schema';
import customValidation from '@schemas/validation';



async function payment(req: Request, res: Response, next: NextFunction) {
    try {
        const responseValidation = customValidation.validation(
            paymentSchema,
            req.body
        );
        if (!responseValidation.success) {
            const { success, data } = responseValidation;
            return res.status(422).json({ success, data });
        }
        const body = responseValidation.data as typePaymentSchema;

        const job = await jobs.payments.add(body);

        return res.status(201).json({ data: {proccess: job }, message: 'Pagamento pendente.' });
    } catch (error) {
        next(error);
    }
}

export default {
    payment,
};
