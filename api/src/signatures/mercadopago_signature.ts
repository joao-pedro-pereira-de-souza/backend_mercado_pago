
import { Signature } from './index';

interface dataSecret {
  x_signature: string;
  x_request_id: string;
  data_id: string;
}
export class SignatureMercadoPago {
    private static getTemplateReceived(secret_received: dataSecret) {
        const { data_id, x_request_id, x_signature } = secret_received;

        const [timestamp_template, key_signature_template] = x_signature.split(',');

        const timestamp = timestamp_template.split('=')[1];
        const key_signature = key_signature_template.split('=')[1];

        return {
            data: `id:${data_id};request-id:${x_request_id};ts:${timestamp};`,
            key_signature,
        };

    }

    static validation(secret_received: dataSecret) {
        const {
            NODE_ENV,
            WEBHOOK_SIGNATURE_PAYMENT_PRODUCTION,
            WEBHOOK_SIGNATURE_PAYMENT_SENDBOX,
        } = process.env;

        const secretMercadoPago =
      NODE_ENV === 'production'
          ? WEBHOOK_SIGNATURE_PAYMENT_PRODUCTION
          : WEBHOOK_SIGNATURE_PAYMENT_SENDBOX;

        const { data, key_signature } = this.getTemplateReceived(secret_received);


        const instance = Signature.getInstance(String(secretMercadoPago));

        const isValid = instance.validation(data, key_signature);

        return isValid;
    }
}
