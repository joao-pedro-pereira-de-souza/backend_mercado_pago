import { Schema, ZodError } from 'zod';

import { DefaultResponseParams } from '@interfaces/response';



export interface ParamsValidationErro {
  success: boolean
  data: ParamsParseSchema[]
}

export interface ParamsParseSchema {
  code: string
  expected: string
  received: string
  path: string[]
  message: string
}


interface ResponseGetArrayParamsError extends DefaultResponseParams {
    data?: string[]
}
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

    static reduceParamsError(dataError: ParamsParseSchema[]): ResponseGetArrayParamsError {
        try {

            const reduceData = dataError.reduce((item, teste) => {
                const join = [...item, ...teste.path];
                return join as never[];
            }, []);

            return {
                success: true,
                data: reduceData
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ocorreu um erro ao tentar converter o array do validation para array string'
            };
        }

    }
}
