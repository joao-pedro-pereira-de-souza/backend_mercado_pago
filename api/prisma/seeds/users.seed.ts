
import usersPermissionClient from './contents/users-permission-client.json';

import permissions from '../../src/contents/permissions';
import customCrypto from '../../src/libs/crypto';

import { PrismaTransactionalClient } from '../connection';
export class UsersSeed {
    #prisma;
    constructor(prisma: PrismaTransactionalClient) {
        this.#prisma = prisma;
    }

    async #createClient() {
        const getPermission = await this.#prisma.permission.findFirst({
            where: {
                number: permissions.CLIENT,
            },
        });

        if (!getPermission) {
            throw new Error(
                'Erro ao tentar cadastrar usuário client: permission not found'
            );
        }

        const promiseAllUsersClients = usersPermissionClient.map((user) => {
            return this.#prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name,
                    id_permission: getPermission.id,
                    password: customCrypto.generate(user.password),
                    Client: {
                        create: {
                            cpf: user.cpf,
                        },
                    },
                },
            });
        });
        await Promise.all(promiseAllUsersClients);
    }

    async #allCreates() {
        await this.#createClient();
    }

    async inicialize() {
        await this.#allCreates();
    }
}
