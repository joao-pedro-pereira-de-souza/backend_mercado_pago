import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PreferenceSearchResponse } from 'mercadopago/dist/clients/preference/search/types';

interface ParamsItemsPreference {
  id: string;
  title: string;
  unit_price: number;
  picture_url: string;
  quantity: number;
  category_id: string;
  currency_id: string;
  description: string;
}
export interface ParamsCreatePreferences {
  id: string;
  title: string;
  amount: number;
  value: number;
  description: string;
  image: string;
  client: {
    email: string;
    name: string;
    cpf: string;
  };
  expiration_from: string;
  expiration_to: string;
}

export class PreferenceProducts {
    constructor(protected readonly client: MercadoPagoConfig) {}

    async getOnePagePreferences(): Promise<
    Pick<PreferenceSearchResponse, 'elements'>
    > {
        const preference = new Preference(this.client);
        const { elements } = await preference.search();

        return { elements };
    }

    async create(params: ParamsCreatePreferences): Promise<any> {
        const preference = new Preference(this.client);
        const { client } = params;

        const product = await preference.create({
          body: {
            expires: true,
            expiration_date_from: params.expiration_from,
            expiration_date_to: params.expiration_to,
            items: [
              {
                id: params.id,
                title: params.title,
                quantity: params.amount,
                unit_price: params.value,
                description: params.description,
              },
            ],
            payer: {
              email: client.email,
              name: client.name,
              identification: {
                type: "cpf",
                number: client.cpf,
              },
            },
            back_urls: {
              success: process.env.ADDRESS_API + "/payments/success",
              failure: process.env.ADDRESS_API + "/payments/failure",
            },
          },
        });

        return product;
    }
}
