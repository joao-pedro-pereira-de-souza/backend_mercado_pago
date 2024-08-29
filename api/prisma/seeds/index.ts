import prisma from '../connection';
import {Prisma} from 'prisma/prisma-client';
import {PermissionsSeed} from './permissions.seed';
import {UsersSeed} from './users.seed';
import {ProductsSeed} from './products.seed';

async function Main() {


    try {

        await prisma.$transaction(
            async (trx) => {
                const permissionsSeed = new PermissionsSeed(trx);
                const usersSeed = new UsersSeed(trx);
                const productsSeed = new ProductsSeed(trx);

                await permissionsSeed.inicialize();
                await usersSeed.inicialize();
                await productsSeed.inicialize();
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }
        );
    } catch (error) {
        console.log(error);
    }

}
Main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
