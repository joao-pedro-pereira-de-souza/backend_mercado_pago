import { Response, Request, NextFunction } from 'express';
import { describe, it, expect , jest, beforeEach } from '@jest/globals';
import supertest from 'supertest';

describe('#E2E /users', () => {
    beforeEach(() => {

        jest.clearAllMocks();
        jest.resetModules();

        jest.mock('@prisma/client');

        jest.spyOn(console, 'error').mockImplementation(()=>{});
    });

    it('should return success GET /users', async () => {

        const {default: userRepository} = await import('@repositories/user_repository');
        const mockUsers = [
            {
                name: 'test',
                email: 'superTest@gmail.com',
                photo: null
            },
            {
                name: 'test',
                email: 'superTest@gmail.com',
                photo: 'https://static.escolakids.uol.com.br/2023/01/quadrinho-ilustrado-com-a-representacao-do-ruido-feito-por-uma-explosao-boom-um-exemplo-de-onomatopeia.jpg'
            }
        ];
        jest.spyOn(userRepository, 'findManyPartial').mockResolvedValue(mockUsers);

        const setup = await import('@middlewares/setup');

        const apiService = supertest(setup.app);
        const response = await apiService.get('/users');

        expect(response.status).toBe(200);

        const body = response.text ? JSON.parse(response.text) : {};
        expect(body).toHaveProperty('data');

        const isObject = typeof body.data === 'object' && !Array.isArray(body.data);
        const isArray = Array.isArray(body.data);
        expect(isObject || isArray).toBe(true);

        if (isArray) {
            const expectedDataArray = [
                {

                    name: expect.any(String),
                    email: expect.any(String),
                    photo:  null
                },
                {

                    name: expect.any(String),
                    email: expect.any(String),
                    photo: expect.any(String),
                },
            ];

            expect(body.data).toEqual(expectedDataArray);
        }

    });

    it('should catch controller error GET /users', async () => {
        const { default: controllerUser } = await import('@controllers/user_controller');
        jest.spyOn(controllerUser, 'list').mockImplementationOnce(async (req: Request, res: Response, next: NextFunction) => {
            try {
                next(new Error('simulated error'));
            } catch (error) {
                return undefined;
            }

        });

        const { app } = await require('@middlewares/setup');
        const apiService = supertest(app);

        const response = await apiService.get('/users');

        expect(response.status).toEqual(500);
        const body = response.text ? JSON.parse(response.text) : {};
        expect(body.message).toEqual('Ocorreu um erro no sistema');
    });

    it('should enter parameter email validation error POST /users', async () => {
        const body = {
            name: 'joao',
            email: 'john',
            password:'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);
        const response = await apiService
            .post('/users')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(422);
        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        expect(bodyReturn.success).toEqual(false);

        const expectedValidation = [
            {
                validation: 'email',
                code: 'invalid_string',
                message: 'Invalid email',
                path: ['email']
            }
        ];
        expect(bodyReturn.data).toEqual(expectedValidation);
    });

    it('should enter all parameters validation error POST /users', async () => {
        const body = {

        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);
        const response = await apiService
            .post('/users')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(422);
        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        expect(bodyReturn.success).toEqual(false);

        const expectedValidation = [
            {
                code: 'invalid_type', expected: 'string', received: 'undefined', path: ['name'], message: 'Required'
            },
            {
                code: 'invalid_type', expected: 'string', received: 'undefined', path: ['email'], message: 'Required'

            },
            {
                code: 'invalid_type', expected: 'string', received: 'undefined', path: ['password'], message: 'Required'

            }
        ];

        expect(bodyReturn.data).toEqual(expectedValidation);

    });

    it('should get permission client error POST /users', async () => {
        const { default: permissionRepository } = await import('@repositories/permission_repository');
        jest.spyOn(permissionRepository, 'getByNumber').mockResolvedValue(null);

        const body = {
            name: 'john',
            email: 'joaoQA@gmail.com',
            password:'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);
        const response = await apiService
            .post('/users')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);

        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const expectedReturn = {
            success: false,
            message: 'Permissão não encontrada no sistema'
        };
        expect(bodyReturn).toEqual(expectedReturn);

    });

    it('should throw get permission client throw POST /users', async () => {
        const { default: prisma } = await import('@root/prisma/connection');

        jest.spyOn(prisma.permission, 'findUnique').mockRejectedValue(new Error('Mock error search permission'));

        const body = {
            name: 'john',
            email: 'joaoQA@gmail.com',
            password:'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);
        const response = await apiService
            .post('/users')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);

        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const expectedReturn = {
            success: false,
            message: 'Ocorreu um erro ao consultar a permissão do usuário'
        };
        expect(bodyReturn).toEqual(expectedReturn);

    });

    it('should enter the already existing email error POST /users', async () => {
        const { default: prisma } = await import('@root/prisma/connection');

        const mockPermission = {
            id: '1381f196-565b-4a3b-8f71-eed606e6f6eb',
            number: 1,
            type: 'client',
            deleted_at: null
        };

        jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(mockPermission);

        const mockReturnPrisma = {
            id: '20ba5b3d-026d-4104-b3a9-8906b2243f5f',
            name: 'joao',
            email: 'johnqa1@gmail.com',
            password: 'teste123',
            photo: null,
            id_permission: '1381f196-565b-4a3b-8f71-eed606e6f6eb',
            deleted_at: null
        };

        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockReturnPrisma);

        const body = {
            name: 'john',
            email: 'joaoQA@gmail.com',
            password:'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);
        const response = await apiService
            .post('/users')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);

        const bodyReturn = response.text ? JSON.parse(response.text) : {};

        const expectedReturn = {
            message: 'Já existe um usuário com o email cadastrado.'
        };
        expect(bodyReturn).toEqual(expectedReturn);
    });

    it('should return success POST /users', async () => {
        const { default: prisma } = await import('@root/prisma/connection');

        const mockPermission = {
            id: '1381f196-565b-4a3b-8f71-eed606e6f6eb',
            number: 1,
            type: 'client',
            deleted_at: null
        };

        jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(mockPermission);
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);


        const mockCreateUserPrisma = {
            id: '20ba5b3d-026d-4104-b3a9-8906b2243f5f',
            name: 'joao',
            email: 'johnqa1@gmail.com',
            password: 'teste123',
            photo: null,
            id_permission: '1381f196-565b-4a3b-8f71-eed606e6f6eb',
            deleted_at: null
        };
        jest.spyOn(prisma.user, 'create').mockResolvedValue(mockCreateUserPrisma);

        const body = {
            name: 'john',
            email: 'joaoQA@gmail.com',
            password:'teste123'
        };

        const { app } = await import('@middlewares/setup');
        const apiService = supertest(app);
        const response = await apiService
            .post('/users')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.status).toEqual(201);

        const expectedReturn = {
            id: expect.any(String),
            name:  expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            photo: null,
            id_permission: expect.any(String),
            deleted_at: null
        };
        const bodyReturn = response.text ? JSON.parse(response.text) : {};
        expect(bodyReturn.data).toEqual(expectedReturn);
    });
});
