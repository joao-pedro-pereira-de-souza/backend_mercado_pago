import prisma from '@root/prisma/connection';
import { Permission } from '@prisma/client';

export interface ParamsModelPermission {
    id: string;
    number: number;
    type: string;
    deleted_at: Date | null;
}

class PermissionRepository {

    async getByNumber(number: number): Promise<Permission | null> {
        return prisma.permission.findUnique({ where: { number } });
    }


}


export default new PermissionRepository();
