import { describe, it, expect , jest, beforeEach } from '@jest/globals';
import supertest from 'supertest';
import customValidation from '@schemas/validation';

describe('#E2E /auth', () => {
    beforeEach(() => {

        jest.clearAllMocks();
        jest.resetModules();

        jest.mock('@prisma/client');
    });

    it('should return error in parameter validation', async () => {

        const mockBody = {
            email: 3,
            password: 3
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);

        const response = await apiService
            .post('/auth')
            .send(mockBody)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(422);

        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const paramsError = customValidation.reduceParamsError(bodyReturn.data);
        expect(paramsError.success).toEqual(true);
        const expectValuesParams = [ 'password', 'email'];
        expect(paramsError.data?.sort()).toEqual(expectValuesParams.sort());

        const expectedInvalidParams = {
            success: false,
            data: [
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    path: [
                        'email'
                    ],
                    message: 'Expected string, received number'
                },
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    path: [
                        'password'
                    ],
                    message: 'Expected string, received number'
                }
            ]
        };

        expect(bodyReturn).toEqual(expectedInvalidParams);
    });

    it('should return error when sending unregistered email', async () => {
        const { default: prisma } = await import('@root/prisma/connection');
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

        const mockBody = {
            email: 'jest@gmail.com',
            password: 'senha123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);

        const response = await apiService
            .post('/auth')
            .send(mockBody)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(404);
        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const expectedResponse = {
            message: 'Usuário não encontrado.'
        };
        expect(bodyReturn).toEqual(expectedResponse);
    });

    it('should return an error when trying to log into an account with an invalid password', async () => {
        const { default: customCrypto } = await import('@libs/crypto');
        jest.spyOn(customCrypto, 'compare').mockReturnValue(false);


        const { default: prisma } = await import('@root/prisma/connection');
        const {default: mockUser } = await import('../../mock/user.json');
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

        const mockBody = {
            email: mockUser.email,
            password: 'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);

        const response = await apiService
            .post('/auth')
            .send(mockBody)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);
        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const expectedResponse = {
            message: 'Senha incorreta.'
        };

        expect(bodyReturn).toEqual(expectedResponse);

    });

    it('should return success request and returm parameter', async () => {
        const { default: mockUser } = await import('../../mock/user.json');
        const { default: mockPermission } = await import('../../mock/permission.json');

        const { default: userRepository } = await import('@repositories/user_repository');


        const mockGetByEmail = {
            ...mockUser,
            permission: {
                type: mockPermission.type
            }
        };
        jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(mockGetByEmail);

        const mockBody = {
            email: mockUser.email,
            password: 'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);

        const response = await apiService
            .post('/auth')
            .send(mockBody)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(200);

        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const expectedResponse = {
            token: expect.any(String),
            client: {
                id: expect.any(String),
                email: expect.any(String),
                name: expect.any(String),
                photo: null,
                deleted_at: null,
                permission: {
                    type: expect.any(String),
                },
            },
        };

        expect(bodyReturn).toEqual(expect.objectContaining(expectedResponse));
    });
});
