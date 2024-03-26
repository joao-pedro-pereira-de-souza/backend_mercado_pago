import { Express , Request, Response, NextFunction} from 'express';
import CustomResponse from '@utils/response_status';

function UseCathError(app: Express) {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error) {

            const data = {
                message: 'Ocorreu um erro no sistema'
            };
            return CustomResponse.getResponse('DEFAULT', res, data);
        }
        next();
    });
}

export default UseCathError;
