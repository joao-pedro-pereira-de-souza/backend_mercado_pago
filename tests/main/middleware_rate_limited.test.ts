

import { describe, it, expect , beforeEach , jest} from '@jest/globals';
import supertest from 'supertest';

import TestAgent from 'supertest/lib/agent';
import UtilsResponse from '@utils/response_status';


async function LoopRequests(count: number, requests: any[], apiRequest: TestAgent ) {
    try {
        if (count === 0) {
            return requests;
        }

        const response = await apiRequest.get('/').expect('Content-Type', /json/);
        requests.push(response);
        await LoopRequests(count - 1, requests, apiRequest);
    } catch (error) {
        return [];
    }

}


describe('#Middleware Rate Limited', () => {

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });

    });

    it('should must enter the rate limited middleware', async () => {

        process.env.NODE_ENV = 'development';
        process.env.PORT = 3636;
        process.env.RATE_LIMIT_TIME = 90000;
        process.env.RATE_LIMIT_LIMIT_REQUESTS = 3;


        const { app } = await require('../../src/middlewares/setup.ts');
        const apiRequest = supertest(app);

        const limitRequests = Number(process.env.RATE_LIMIT_LIMIT_REQUESTS) + 5;

        const requests: any[] = [];
        await LoopRequests(limitRequests, requests, apiRequest);

        const lastRequest = requests.pop();

        expect(lastRequest.status).toBe(UtilsResponse.STATUS.RATE_LIMITED);
        const responseJson = lastRequest.text ? JSON.parse(lastRequest.text) : {};

        const expected = {
            status: UtilsResponse.STATUS.RATE_LIMITED,
            message: 'Limite de taxa excedido. Tente novamente mais tarde.',
            data: null
        };

        expect(responseJson).toEqual(expected);

    });
});
