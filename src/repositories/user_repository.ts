import prisma from '@root/prisma/connection';
import { User } from '@prisma/client';


interface ParamsCreateInterface extends Pick<User, 'name' | 'email' | 'password' | 'id_permission'>{
   photo?:  string | null | undefined;
}

interface modelUserCustom extends User  {
    permission: {
        type: string
    }
}
class UserRepository {

    async findManyPartial(select: object): Promise<Partial<User>[]> {
        return prisma.user.findMany({ select });
    }


    async getByEmail(email: string): Promise<Partial<modelUserCustom> | null>{
        return prisma.user.findUnique({
            where: { email: email },
            select: {
                deleted_at: true,
                email: true,
                id: true,
                id_permission: true,
                name: true,
                password: true,
                photo: true,
                permission: { select: { type: true } }
            }

        });
    }

    async create(data: ParamsCreateInterface) {
        return prisma.user.create({ data });
    }
}


export default new UserRepository();
