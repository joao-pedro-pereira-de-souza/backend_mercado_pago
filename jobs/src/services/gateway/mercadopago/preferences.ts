import { MercadoPagoConfig, Preference  } from 'mercadopago';
import { PreferenceSearchResponse } from 'mercadopago/dist/clients/preference/search/types';

import {randomUUID} from 'crypto'
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
    id_user: string;
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
            payment_methods: {
              default_installments: 1,
              installments: 6
            },
            payer: {
              email: client.email,
              name: client.name,
              identification: {
                type: "cpf",
                number: client.cpf,
              },
            },
            external_reference: `id_user:${
              client.id_user
            }@key_random:${randomUUID({
              disableEntropyCache: true,
            })}`,
            back_urls: {
              success:
                process.env.URL_CLIENT +
                "/src/pages/payment/index.html?type=success",
              failure:
                process.env.URL_CLIENT +
                "/src/pages/payment/index.html?type=failure",
            },
          },
        });

        return product;
    }
}
