import { Request, Response, NextFunction } from 'express';
import CustomResponse from '@utils/response_status';
import LibJwt from '@libs/jwt';

function Authentication(permissions?: number[]) {
    return (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers['authorization'];

        if (!token) {
            return CustomResponse.getResponse('UNAUTHORIZED', res, { message: 'Token de autenticação não encontrado.'});
        }

        const [bearer, hash] = token.split(' ');

        if (!bearer || !hash) {
            return CustomResponse.getResponse('UNAUTHORIZED', res, { message: 'Token malformado.'});
        }

        const responseVerify = LibJwt.verifyToken(hash);
        if (!responseVerify.success) {

            const data: any = { message: responseVerify.message };
            if (responseVerify.error.message === 'jwt expired') {
                data.expired_at = responseVerify.error?.expiredAt;
                data.is_token_expired = true;


            }
            return CustomResponse.getResponse('UNAUTHORIZED', res, data);
        }


        next();
    };
}


export default Authentication;
