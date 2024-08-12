import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('#Unitaty: libs/jwt', () => {

    const JWT_SECURITY = 'ce09382f-6d0f-418e-90ea-370815804bd6';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should case message error invalid token', async () => {

        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: jwt} = await import('jsonwebtoken');

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('invalid token');
        });

        const verify = customJwt.verifyToken('teste');

        expect(verify.success).toEqual(false);
        expect(verify.message).toEqual('Token inválido.');

    });

    it('should case message error jwt malformed', async () => {

        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: jwt} = await import('jsonwebtoken');

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('jwt malformed');
        });

        const verify = customJwt.verifyToken('teste');

        expect(verify.success).toEqual(false);
        expect(verify.message).toEqual('Token malformado.');
    });

    it('should case message error wt expired', async () => {
        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: jwt} = await import('jsonwebtoken');

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('jwt expired');
        });

        const verify = customJwt.verifyToken('teste');

        expect(verify.success).toEqual(false);
        expect(verify.message).toEqual('A sessão do token foi expirado.');
    });

    it('should case message error default', async () => {
        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: jwt} = await import('jsonwebtoken');

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('erro not case get message, default message');
        });

        const verify = customJwt.verifyToken('teste');

        expect(verify.success).toEqual(false);
        expect(verify.message).toEqual('Ocorreu um erro no token enviado.');
    });

    it('should expire valid token after expiry time', async () => {
        jest.useFakeTimers();
        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: jwt} = await import('jsonwebtoken');
        const {default: mockUser} = await import('../mock/user.json');

        jest.spyOn(jwt, 'verify');

        const hash = customJwt.generateToken({
            data: {
                id: mockUser.id,
                email: mockUser.email
            },
            expiresIn: '7days',
        });

        const verify = customJwt.verifyToken(hash);

        expect(verify.success).toEqual(true);

        const expected = {
            id: expect.any(String),
            email: expect.any(String),
            iat: expect.any(Number),
            exp: expect.any(Number)
        };

        expect(verify.data).toEqual(expected);

        const daysMilliseconds = 24 * 60 * 60 * 1000;
        jest.advanceTimersByTime(8 * daysMilliseconds);

        const tokenAfterDays = customJwt.verifyToken(hash);

        expect(tokenAfterDays.success).toEqual(false);
        expect(tokenAfterDays.message).toEqual('A sessão do token foi expirado.');


    });

    it('should success verifyToken', async () => {

        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: mockUser} = await import('../mock/user.json');

        const hash = customJwt.generateToken({
            data: {
                id: mockUser.id,
                email: mockUser.email
            },
            expiresIn: '7days',
        });


        const verify = customJwt.verifyToken(hash);
        expect(verify.success).toEqual(true);

        const expected = {
            id: expect.any(String),
            email: expect.any(String),
            iat: expect.any(Number),
            exp: expect.any(Number)
        };

        expect(verify.data).toEqual(expected);
    });


    it('should have all parameters', async () => {

        process.env.JWT_SECURITY = JWT_SECURITY;

        const { default: customJwt } = await import('@libs/jwt');
        const {default: jwt} = await import('jsonwebtoken');
        const {default: mockUser} = await import('../mock/user.json');

        jest.spyOn(jwt, 'verify');
        jest.spyOn(jwt, 'sign');

        const hash = customJwt.generateToken({
            data: {
                id: mockUser.id,
                email: mockUser.email
            },
            expiresIn: '7days',
        });

        const verify = customJwt.verifyToken(hash);

        expect(verify.success).toEqual(true);

        const expected = {
            id: expect.any(String),
            email: expect.any(String),
            iat: expect.any(Number),
            exp: expect.any(Number)
        };

        expect(verify.data).toEqual(expected);

        expect(jwt.verify).toHaveBeenCalledWith(hash, JWT_SECURITY);
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id: mockUser.id,
                email: mockUser.email
            },
            JWT_SECURITY,
            {
                expiresIn: '7days'

            }
        );
    });
});
