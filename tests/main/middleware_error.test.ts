import  {Response, Request, NextFunction} from 'express';

import { describe, it, expect,  beforeEach , jest } from '@jest/globals';
import supertest from 'supertest';

import mainController from '@controllers/mainController';

describe('#Middleware Error', () => {

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });

    });

    it('should must enter the error middleware', async () => {
        process.env.NODE_ENV = 'test';
        //arrange
        jest.spyOn(mainController, 'main').mockImplementationOnce(async (req: Request, res: Response, next: NextFunction) => {
            try {
                next(new Error('simulated error'));
            } catch (error) {
                return undefined;
            }

        });

        //act

        const { app } = await import('@middlewares/setup');

        const apiRequest = supertest(app);
        const response = await apiRequest.get('/').expect('Content-Type', /json/);

        //assert
        const expected = {
            status: 500,
            body: {
                message: 'Ocorreu um erro no sistema'
            }

        };

        expect(response.status).toBe(expected.status);
        const responseJson =response.text ? JSON.parse(response.text) : {};
        expect(responseJson).toEqual(expected.body);

    });

});
