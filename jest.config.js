/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    modulePaths: ['./tests'],
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@functions/(.*)$': '<rootDir>/src/functions/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1'

    },
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true
};

module.exports = config;
