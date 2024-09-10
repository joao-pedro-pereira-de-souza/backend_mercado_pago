import { Request, Response, NextFunction } from 'express';
import { writeFile } from 'fs/promises';

import {SignatureMercadoPago} from '@signatures/mercadopago_signature';

async function success(req: Request, res: Response, next: NextFunction) {
    try {
        const data = {
            body: req.body,
            query: req.query,
            headers: req.headers,
            header: req.header,
            url: req.url,
        };

        const xSignature = req.headers['x-signature'] as string;
        const xRequestId = req.headers['x-request-id'] as string;

        const dataId = req.query['data.id'] as string;
        console.log({ signature: xSignature, xRequestId, dataId });

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
            x_signature:xSignature
        });

        if (!isSignatureValid) {
            return res.status(401).json({ message: 'Signature invalid.' });
        }

        await writeFile('payment_success.json', JSON.stringify(data, null, 2));

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
