
import { Request, Response, NextFunction } from 'express';

import { createUserSchema, typeCreateUserSchema } from '@schemas/user_schema';
import customValidation from '@schemas/validation';

import ServicePermissions from '@services/permissions';
import permissions from '@contents/permissions';

import userRepository from '@repositories/user_repository';

import customCrypto from '@libs/crypto';

async function list (req: Request, res: Response, next: NextFunction) {
    try {
        const select = { name: true, email: true, photo: true};
        const users = await userRepository.findManyPartial(select);

        return res.status(200).json({ data: users });

    } catch (error) {
        next(error);
    }
}

async function create (req: Request, res: Response, next: NextFunction) {
    try {

        const responseValidation = customValidation.validation(createUserSchema, req.body);
        if (!responseValidation.success) {
            const { success, data } = responseValidation;
            return res.status(422).json({ success, data });
        }
        const data = responseValidation.data as typeCreateUserSchema;
        const formatData = {
            ...data,
            email: data.email.toLowerCase()
        };
        const responseGetPermission = await ServicePermissions.getPermissionByUniqueNumber(permissions.CLIENT);
        if (!responseGetPermission.success) {
            const { success, message } = responseGetPermission;
            return res.status(401).json({ success, message });
        }

        const getUserByEmail = await userRepository.getByEmail(formatData.email);
        if (getUserByEmail) {
            return res.status(401).json({ message: 'Já existe um usuário com o email cadastrado.'});
        }


        const permission = responseGetPermission.data;
        const {name, email, photo, password, cpf} = formatData;
        const dataCreate = {
            name,
            email,
            photo,
            cpf,
            password: customCrypto.generate(password),
            id_permission: permission.id as string,
        };
        const user = await userRepository.createUserClient(dataCreate);

        return res.status(201).json({ data: user });

    } catch (error) {
        next(error);
    }
}

export default {
    list,
    create
};
