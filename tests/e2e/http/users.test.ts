import { describe, it, expect } from '@jest/globals';
import supertest from 'supertest';

describe('#E2E /users', () => {
    it('should return success users', async () => {


        const { app } = await import('@middlewares/setup');

        const apiService = supertest(app);

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
                    photo: expect.any(String),
                }
            ];

            expect(body.data).toEqual(expectedDataArray);
        }
    });
});
