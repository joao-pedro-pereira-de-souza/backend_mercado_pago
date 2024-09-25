import { MercadoPagoConfig } from 'mercadopago';
import { PreferenceProducts } from './preferences';


class Main {
  public client: MercadoPagoConfig;
  public preference: PreferenceProducts;

  constructor() {
    const {
      NODE_ENV,
      MERCADO_PAGO_ACCESS_TOKEN_PRODUCTION,
      MERCADO_PAGO_ACCESS_TOKEN_SENDBOX,
    } = process.env;

    const token =
      NODE_ENV === "production"
        ? MERCADO_PAGO_ACCESS_TOKEN_PRODUCTION
        : MERCADO_PAGO_ACCESS_TOKEN_SENDBOX;

    const paramsMercadoPago: MercadoPagoConfig = {
      accessToken: String(token),
      options: {
        integratorId: process.env.MERCADO_PAGO_INTEGRATION,
      },
    };
    const client = new MercadoPagoConfig(paramsMercadoPago);

    this.client = client;
    this.preference = new PreferenceProducts(client);
  }
}

export default new Main();
