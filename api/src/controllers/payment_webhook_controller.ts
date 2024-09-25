import { Request, Response, NextFunction } from 'express';
import { writeFile } from 'fs/promises';

import { SignatureMercadoPago } from '@signatures/mercadopago_signature';
import { BodyWebhookPayment } from '@interfaces/mercadopago/webhook.payment';

import MercadoPago from '@services/gateway/mercadopago';

import OrderService from '@services/order';



async function success(
    req: Request<any, any, BodyWebhookPayment, any>,
    res: Response,
    next: NextFunction
) {
    try {
        const xSignature = req.headers['x-signature'] as string;
        const xRequestId = req.headers['x-request-id'] as string;

        const dataId = req.query['data.id'] as string;
        if (!xSignature || !xRequestId || !dataId) {
            return res.status(401).json({ message: 'Signature not found.' });
        }

        if (!req.body) {
            return res
                .status(422)
                .json({ message: 'Message body data not received' });
        }

        const isSignatureValid = SignatureMercadoPago.validation({
            data_id: dataId,
            x_request_id: xRequestId,
            x_signature: xSignature,
        });

        if (!isSignatureValid) {
            return res.status(401).json({ message: 'Signature invalid.' });
        }

        const { data } = req.body;

        const paymentMercadoPago: any = await MercadoPago.payment.findById(data.id);
        if (paymentMercadoPago) {
            await OrderService.save(paymentMercadoPago);
        }


        return res.status(200).json();
    } catch (error) {
        next(error);
    }
}


async function failure(req: Request, res: Response, next: NextFunction) {
    try {

        const data = {
            body: req.body,
            query: req.query,
            headers: req.headers,
            header: req.header,
            url: req.url,
        };

        writeFile('payment_failure.json', JSON.stringify(data, null, 2));

        return res.status(200).json();
    } catch (error) {
        next(error);
    }
}

export default {
    success,
    failure,
};
