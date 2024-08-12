import { DefaultResponseParams } from '@interfaces/response';
import permissionRepository from '@repositories/permission_repository';

export default class {

    public static async getPermissionByUniqueNumber(permission_number: number): Promise<DefaultResponseParams> {
        try {
            const permission = await permissionRepository.getByNumber(permission_number);

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
