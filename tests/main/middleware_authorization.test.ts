import  {Response, Request, NextFunction, Router} from 'express';

import { describe, it, expect , jest, beforeEach} from '@jest/globals';
import supertest from 'supertest';

import MiddlewareAuthorization from '@middlewares/authentication';
import * as FunctionRoutes from '@routes/index';
import LibJwt from '@libs/jwt';


function ControllerAuthorization(req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({message: 'Ok', data: { id: 1}});
    } catch (error) {
        next(error);
    }
}

describe('#Middleware Authorization', () => {

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });

    });

    const _idUser = '5814ab35-1086-4e1d-b11b-d7f0f1461d6a';
    const _secret_jwt = 'dc5dbe72-5d9e-42bc-8e0f-839ef0c3ddf2';

    it('should return success when entering a route with permissionless authentication', async () => {
        process.env.JWT_SECURITY = _secret_jwt;
        const mockRoutes = jest.spyOn(FunctionRoutes, 'Routes');
        mockRoutes.mockImplementationOnce((app: Router) => {
            app.get('/test', MiddlewareAuthorization([1]),  ControllerAuthorization);
        });


        const paramsGenerateToken = {
            expiresIn: '1h',
            data: {
                id: _idUser,

            },
        };
        const token = LibJwt.generateToken(paramsGenerateToken);


        const { app } = await import('@middlewares/setup');

        const apiRequest = supertest(app);

        const response = await apiRequest.get('/test')
            .set('authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/);


        expect(response.status).toEqual(200);

        const body = response.text ? JSON.parse(response.text) : {};
        const expired = {
            message: expect.any(String),
            data: expect.any(Object)
        };

        expect(body).toEqual(expired);
        jest.restoreAllMocks();

    });

    it('should return an error when entering a route with authentication without the token', async () => {
        const mockRoutes = jest.spyOn(FunctionRoutes, 'Routes');
        mockRoutes.mockImplementationOnce((app: Router) => {
            app.get('/test', MiddlewareAuthorization([1]),  ControllerAuthorization);
        });

        const { app } = await import('@middlewares/setup');

        const apiRequest = supertest(app);

        const response = await apiRequest.get('/test').expect('Content-Type', /json/);
        expect(response.status).toEqual(401);

        const body = response.text ? JSON.parse(response.text) : {};
        const expired = {
            message: 'Token de autenticação não encontrado.'
        };

        expect(body).toEqual(expired);
        jest.restoreAllMocks();
    });

    it('should return error when entering a route with bad formatted authentication', async () => {
        process.env.JWT_SECURITY = _secret_jwt;
        const mockRoutes = jest.spyOn(FunctionRoutes, 'Routes');
        mockRoutes.mockImplementationOnce((app: Router) => {
            app.get('/test', MiddlewareAuthorization([1]),  ControllerAuthorization);
        });


        const paramsGenerateToken = {
            expiresIn: '1h',
            data: {
                id: _idUser,

            },
        };
        const token = LibJwt.generateToken(paramsGenerateToken);
        const { app } = await import('@middlewares/setup');
        const apiRequest = supertest(app);
        const response = await apiRequest.get('/test')
            .set('authorization', `${token}`)
            .expect('Content-Type', /json/);


        expect(response.status).toEqual(401);

        const body = response.text ? JSON.parse(response.text) : {};
        const expired = {
            message: 'Token malformado.'
        };

        expect(body).toEqual(expired);
        jest.restoreAllMocks();
    });

    it('should return an error when entering the route with authentication with an expired token', async () => {
        jest.useFakeTimers();
        process.env.JWT_SECURITY = _secret_jwt;
        const mockRoutes = jest.spyOn(FunctionRoutes, 'Routes');
        mockRoutes.mockImplementationOnce((app: Router) => {
            app.get('/test', MiddlewareAuthorization([1]),  ControllerAuthorization);
        });


        const paramsGenerateToken = {
            expiresIn: '1h',
            data: {
                id: _idUser,

            },
        };
        const token = LibJwt.generateToken(paramsGenerateToken);
        const oneSecond = 1000;
        jest.advanceTimersByTime(((oneSecond * 60) * 60) + oneSecond);

        const { app } = await import('@middlewares/setup');
        const apiRequest = supertest(app);
        const response = await apiRequest.get('/test')
            .set('authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/);



        expect(response.status).toEqual(401);

        const body = response.text ? JSON.parse(response.text) : {};
        const expired = {
            message: 'A sessão do token foi expirado.',
            expired_at: expect.any(String),
            is_token_expired: true
        };

        expect(body).toEqual(expired);
        jest.restoreAllMocks();
    });

});
