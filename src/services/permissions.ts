import prisma from '@root/prisma/connection';
import { DefaultResponseParams } from '@interfaces/response';



export default class {

    public static async getPermissionByUniqueNumber(permission_number: number): Promise<DefaultResponseParams> {
        try {
            const permission = await prisma.permission.findUnique({ where: { number: permission_number } });

            if (!permission) {
                return {
                    success: false,
                    message: 'Permissão não encontrada no sistema'
                };
            }

            return {
                success: true,
                data: permission
            };
        } catch (error) {
            return {
                success: false,
                error,
                message: 'Ocorreu um erro ao consultar a permissão do usuário'
            };
        }
    }
}
