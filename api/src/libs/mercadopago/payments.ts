// import { MercadoPagoConfig, Payment } from 'mercadopago';
// import { PreferenceSearchResponse } from 'mercadopago/dist/clients/preference/search/types';

// interface ParamsCreatePreferences {
//     id: string;
//     title: string;
//     amount: number;
//     value: number
// }
// export class PreferenceProducts {

//     constructor(protected readonly client: MercadoPagoConfig) {}

//     async getOnePagePreferences (): Promise< Pick<PreferenceSearchResponse, 'elements'>> {
//         const preference = new Preference(this.client);
//         const { elements } = await preference.search();

//         return { elements };
//     }

//     async create(params: ParamsCreatePreferences) : Promise<any>{
//         const payment = new Payment(this.client);

//         return await payment.create({

//         });


//     }
// }
