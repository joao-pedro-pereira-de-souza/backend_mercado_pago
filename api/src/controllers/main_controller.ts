
import { Request, Response, NextFunction } from 'express';
import {version, name, engines, author,keywords} from '@root/package.json';

async function main (req: Request, res: Response, next: NextFunction) {
    try {

        return res.status(200).json({
            version,
            name,
            engines,
            author,
            keywords
        });

    } catch (error) {
        next(error);
    }
}


export default {
    main
};
