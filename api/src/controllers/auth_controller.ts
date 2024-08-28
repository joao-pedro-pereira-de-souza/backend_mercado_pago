
import { Request, Response, NextFunction } from 'express';

import { authUserSchema, typeAuthUserSchema } from '@schemas/user_schema';
import customValidation from '@schemas/validation';

import userRepository from '@repositories/user_repository';

import customCrypto from '@libs/crypto';
import customJwt from '@libs/jwt';

async function auth (req: Request, res: Response, next: NextFunction) {
    try {

        const responseValidation = customValidation.validation(authUserSchema, req.body);
        if (!responseValidation.success) {
            const { success, data } = responseValidation;
            return res.status(422).json({ success, data });
        }
        const data = responseValidation.data as typeAuthUserSchema;
        const formatData = {
            ...data,
            email: data.email.toLowerCase()
        };

        const user = await userRepository.getByEmail(formatData.email);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const isPasswordValid = await customCrypto.compare(formatData.password, String(user.password));
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        const { id, email, name, photo, deleted_at, permission } = user;

        const hash = customJwt.generateToken({
            data: {
                id,
                email
            },
            expiresIn: '7days',
        });

        return res.status(200).json({
            token: hash,
            client: {
                id,
                email,
                name,
                photo,
                deleted_at,
                permission
            } });

    } catch (error) {
        next(error);
    }
}

export default {
    auth
};
