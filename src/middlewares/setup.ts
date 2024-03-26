
import cors from 'cors';
import express from 'express';

import { Routes } from '@routes/index';

import RateLimit from './rate_limited';
import UseError from './errors';

const app = express();

app.use(express.json());
app.use(cors());

const node_env = process.env.NODE_ENV;
if (node_env!== 'test') {
    RateLimit(app);
}

Routes(app);
UseError(app);

const env = process.env;
export {
    app,
    env
};
