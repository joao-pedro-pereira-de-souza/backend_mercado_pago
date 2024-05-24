
import { Request, Response, NextFunction } from 'express';
import {version, name, engines, author,keywords} from '@root/package.json';
import MercadoPagoServices from '@services/products';

async function main (req: Request, res: Response, next: NextFunction) {
    try {

        const mercadopago = await MercadoPagoServices.loadProducts();

        return res.status(200).json({
            version,
            name,
            engines,
            author,
            keywords,
            mercadopago
        });

    } catch (error) {
        next(error);
    }
}


export default {
    main
};
