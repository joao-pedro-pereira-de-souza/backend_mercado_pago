import {Response} from 'express';

type optionsStatusGetResponse = 'OK' | 'CREATED' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'RATE_LIMITED' | 'TOKEN_EXPIRED' | 'DEFAULT'

type dataGetResponse = {
    message?: string,
    jwt_expired?: boolean,
    data?: object,
    status?: number
}

export default class {

    static STATUS: any = {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        RATE_LIMITED: 429
    };


    static options = Object.keys(this.STATUS) as string[];


    static getResponse(option_status: optionsStatusGetResponse, res: Response, data?: dataGetResponse): Response {

        return res.status(this.STATUS[option_status] || 500).json(data);

    }
}
