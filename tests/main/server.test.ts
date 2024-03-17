import { Server } from 'http';
import supertest from 'supertest';


import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import { app } from '@middlewares/setup';


import { AddressInfo } from 'net';
import listener from '@functions/listener';


async function OnEventListenerServer(server: Server) {

    return new Promise((resolve, reject) => {
        server.once('listening',() => resolve(true));
        server.once('error',(error) => reject(error));
    });
}

describe('#Server', () => {

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });

    });

    it('should connect server development', async() => {
        // arrange
        const PORT = 3131;
        const NODE_ENV = 'development';

        process.env.NODE_ENV = NODE_ENV;
        process.env.PORT = PORT;

        jest.spyOn(app, 'listen');

        const { server }=  await import('../../src/index');

        await expect(OnEventListenerServer(server)).resolves.toBe(true);
        const address = server.address() as AddressInfo;

        expect(address.port).toBe(PORT);

        expect(app.listen).toHaveBeenCalledWith(String(PORT), listener);
    });

    it('should make the main request successfully', async () => {

        // arrange
        const apiServer = supertest(app);
        const path = '/';
        //act

        const response = await apiServer.get(path).expect('Content-Type', /json/);


        // assert
        expect(response.status).toBe(200);

        const body = response.text ? JSON.parse(response.text) : {};

        const toBeData = {
            version: expect.any(String),
            name: expect.any(String),
            engines: expect.any(Object),
            author: expect.any(String),
            keywords: expect.any(Array)
        };

        expect(body).toEqual(toBeData);
    });
});
