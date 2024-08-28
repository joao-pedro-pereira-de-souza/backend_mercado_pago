
import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

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

const server = http.createServer(app);

const io = new Server(server);

export { app, server, io};
