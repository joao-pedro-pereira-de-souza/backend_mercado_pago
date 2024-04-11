import prisma from '@root/prisma/connection';
import { User } from '@prisma/client';


interface ParamsCreateInterface extends Pick<User, 'name' | 'email' | 'password' | 'id_permission'>{
   photo?:  string | null | undefined;
}
class UserRepository {

    async findManyPartial(select: object): Promise<Partial<User>[]> {
        return prisma.user.findMany({ select });
    }

    async getByEmail(email: string): Promise<Partial<User> | null>{
        return  prisma.user.findUnique({ where: { email: email } });
    }

    async create(data: ParamsCreateInterface) {
        return prisma.user.create({ data });
    }
}


export default new UserRepository();
