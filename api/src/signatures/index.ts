import crypto from 'crypto';

export class Signature {
    constructor(private readonly secret: string) {}

    static getInstance(secret: string) {

        return new Signature(secret);
    }


    validation (payload: string, signature: string) {
        const hmac = crypto.createHmac('sha256', this.secret);

        hmac.update(payload);
        const expectedSignature = hmac.digest('hex');

        return expectedSignature === signature;

    }
}
