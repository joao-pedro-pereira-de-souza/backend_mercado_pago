import {DefaultResponseParams} from '@interfaces/response';



export async function GetPermissionById(id: string): Promise<DefaultResponseParams> {
    try {

        return {
            success: true,
        };
    } catch (error) {

        const message = 'Ocorreu um erro ao verificar a permissão do cliente';
        return {
            success: false,
            error,
            message
        };
    }
}
