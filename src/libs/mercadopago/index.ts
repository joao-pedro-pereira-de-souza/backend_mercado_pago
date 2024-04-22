import Mercadopago, { MercadoPagoConfig } from 'mercadopago';
import { PreferenceProducts } from './products';

class Main  {

    public client: MercadoPagoConfig;

    public products: PreferenceProducts;

    constructor() {

        const {
            NODE_ENV,
            MERCADO_PAGO_ACCESS_TOKEN_PRODUCTION,
            MERCADO_PAGO_ACCESS_TOKEN_SENDBOX
        } = process.env;


        const token = NODE_ENV === 'production' ? MERCADO_PAGO_ACCESS_TOKEN_PRODUCTION : MERCADO_PAGO_ACCESS_TOKEN_SENDBOX;

        const paramsMercadoPago: MercadoPagoConfig = {
            accessToken: String(token),
            options: {
                integratorId: process.env.MERCADO_PAGO_INTEGRATION
            }
        };
        const client = new Mercadopago(paramsMercadoPago);

        this.client = client;
        this.products = new PreferenceProducts(client);
    }

    // init(access_token: string) {

    //     const paramsMercadoPago: MercadoPagoConfig = {
    //         accessToken: access_token,
    //         options: {
    //             integratorId: process.env.MERCADO_PAGO_INTEGRATION
    //         }
    //     };
    //     return new Mercadopago(paramsMercadoPago);
    // }
}

export default new Main();
