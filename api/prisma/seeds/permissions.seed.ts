
import permissions from '../../src/contents/permissions';

import { PrismaTransactionalClient } from '../connection';
export class PermissionsSeed {
    #prisma;
    constructor(prisma: PrismaTransactionalClient) {
        this.#prisma = prisma;
    }

    async #create() {
        await this.#prisma.permission.create({
            data: {
                number: permissions.CLIENT,
                type: 'client',
            },
        });

        await this.#prisma.permission.create({
            data: {
                number: permissions.MASTER,
                type: 'master',
            },
        });
    }

    async inicialize() {
        this.#create();
    }
}
