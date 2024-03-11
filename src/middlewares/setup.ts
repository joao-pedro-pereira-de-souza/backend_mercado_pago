import cors from 'cors';
import express from 'express';

import Routes from '@routes/index';
const app = express();

app.use(express.json());
app.use(cors());

Routes(app);

export {
    app
};
