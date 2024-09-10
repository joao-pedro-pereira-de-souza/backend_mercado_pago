import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('#Unitaty: signatures/mercadopago_signature', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
    it('must return the parameters of the getTemplateReceived method of the SignatureMercadoPago class correctly', async () => {
        const { Signature } = await import('@signatures/index');
        jest.spyOn(Signature.prototype, 'validation').mockReturnValue(true);

        const { SignatureMercadoPago } = await import('@signatures/mercadopago_signature');

        const mockGetTemplateReceived = jest.spyOn(
         SignatureMercadoPago as any,
         'getTemplateReceived'
        );

        const data = {
            data_id: '1319489442',
            x_signature:
           'ts=1725718005,v1=f93cbae217f38d377ffc9510b01fb2b2fcfd5db58b0f2ff134e21d4a33092261',
            x_request_id: '64eba76b-551e-41da-981a-8af3b5a8383a',
        };
        const isValid = SignatureMercadoPago.validation(data);
        expect(isValid).toBe(true);

        expect(mockGetTemplateReceived).toHaveBeenCalledWith(data);

        const resultReceived = mockGetTemplateReceived.mock.results[0].value;
        const expected = {
            data: `id:${data.data_id};request-id:${
                data.x_request_id
            };ts:${1725718005};`,
            key_signature:
           'f93cbae217f38d377ffc9510b01fb2b2fcfd5db58b0f2ff134e21d4a33092261',
        };
        expect(resultReceived).toEqual(expected);

    });
});
