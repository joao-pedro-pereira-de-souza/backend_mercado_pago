import { Schema, ZodError } from 'zod';

import { DefaultResponseParams } from '@interfaces/response';
export default class {

    static validation(schema: Schema, values: unknown  ): DefaultResponseParams {
        try {
            const data = schema.parse(values);
            return {
                success: true,
                data
            };
        } catch (error) {
            if (error instanceof ZodError) {
                const { issues } = error;

                return {
                    success: false,
                    data: issues
                };
            }

            return {
                success: false,
                message: 'Preencha os dados corretamente.'
            };
        }
    }
}
