
import { Request, Response, NextFunction } from 'express';
import prisma from '@root/prisma/connection';

import { createUserSchema, typeCreateUserSchema } from '@schemas/user_schema';
import customValidation from '@schemas/validation';

import ServicePermissions from '@services/permissions';
import permissions from '@contents/permissions';

async function list (req: Request, res: Response, next: NextFunction) {
    try {
        const users = await prisma.user.findMany({select: { name: true, email: true, photo: true}});

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

        const getUserByEmail = await prisma.user.findFirst({ where: { email: formatData.email } });
        if (getUserByEmail) {
            return res.status(401).json({ message: 'Já existe um usuário com o email cadastrado.'});
        }


        const permission = responseGetPermission.data;
        const user = await prisma.user.create({ data: {...formatData, id_permission: permission.id } });

        return res.status(201).json({ data: user });

    } catch (error) {
        next(error);
    }
}

export default {
    list,
    create
};
