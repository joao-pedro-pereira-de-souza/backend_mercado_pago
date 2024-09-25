import { MercadoPagoConfig, Payment } from 'mercadopago';


export class PaymentMercadoPago {
    #sdkPayment;
    constructor(protected readonly client: MercadoPagoConfig) {
        this.#sdkPayment = new Payment(this.client);
    }


    async findById(id: string | number) {
        return this.#sdkPayment.get({ id });
    }
}
