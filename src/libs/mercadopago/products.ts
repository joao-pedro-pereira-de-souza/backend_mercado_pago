import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PreferenceSearchResponse } from 'mercadopago/dist/clients/preference/search/types';

export class PreferenceProducts {

    constructor(protected readonly client: MercadoPagoConfig) {}

    async getOnePagePreferences (): Promise< Pick<PreferenceSearchResponse, 'elements'>> {
        const preference = new Preference(this.client);
        const { elements } = await preference.search();

        return { elements };
    }



}
