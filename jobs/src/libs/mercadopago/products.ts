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
interface ParamsCreatePreferences {
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

interface ParamsUpdatePreferences {
  id: string;
  data: ParamsItemsPreference[];
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


    // #defaultExpirePreference() {

    //     const options =  { timeZone: 'America/Sao_Paulo' };
    //     const now = new Date().toLocaleString('pt-BR', options);
    //     const hoursExpired = 1;
    //     return {
    //         from: now,
    //         to: new Date(now)
    //             .setHours(new Date(now).getHours() + hoursExpired)
    //             .toString(),
    //     };

    // }
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
                        type: 'cpf',
                        number: client.cpf,
                    },
                },
            },
        });

        return product;
    }
    async update(params: ParamsUpdatePreferences): Promise<any> {
        const preference = new Preference(this.client);

        preference.update({
            id: params.id,
            updatePreferenceRequest: {
                items: params.data,
            },
        });

        return preference;
    }
}
