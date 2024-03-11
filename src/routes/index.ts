
import { Router } from 'express';

import {version, name, engines, author,keywords} from '@root/package.json';
export default (app: Router) => {
    app.get('/', (_, res) => {
        return res.status(200).json({
            version,
            name,
            engines,
            author,
            keywords
        });
    });
};
