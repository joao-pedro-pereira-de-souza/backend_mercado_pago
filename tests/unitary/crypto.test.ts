import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('#Unitary: libs/crypto', () => {

    const password = 'teste123';
    const hashReturn = '$2a$10$1RXuMhtr4DzymnO5R.ZKqe9AqDGMepNPoaK1613tCB1stFm5owqOC';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it('should contain all parameters and return the hash of the input value', async () => {
        const { default: bcrypt } = await import('bcryptjs');

        const { default: customCrypto } = await import('@libs/crypto');
        jest.spyOn(bcrypt, 'hashSync');

        const hash = customCrypto.generate(password);

        expect(typeof hash).toBe('string');
        expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
    });

    it('should return error when sending invalid compare value', async () => {
        const { default: bcrypt } = await import('bcryptjs');

        const { default: customCrypto } = await import('@libs/crypto');
        jest.spyOn(bcrypt, 'compareSync');

        const compare = customCrypto.compare('123', hashReturn);

        expect(compare).toEqual(false);
        expect(bcrypt.compareSync).toHaveBeenCalledWith('123', hashReturn);
    });

    it('should return success compare value', async () => {
        const { default: bcrypt } = await import('bcryptjs');

        const { default: customCrypto } = await import('@libs/crypto');
        jest.spyOn(bcrypt, 'compareSync');

        const compare = customCrypto.compare(password, hashReturn);

        expect(compare).toEqual(true);
        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashReturn);
    });
});
