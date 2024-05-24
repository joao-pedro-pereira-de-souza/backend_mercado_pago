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
                integratorId: 'dev_24c65fb163bf11ea96500242ac130004',
            }
        };
        const client = new MercadoPagoConfig(paramsMercadoPago);

        this.client = client;
        this.products = new PreferenceProducts(client);
    }
}

export default new Main();
