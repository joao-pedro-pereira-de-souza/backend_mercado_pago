import { DefaultResponseParams } from '@interfaces/response';
import { ICreatePreference } from '@interfaces/mercadopago/create.preference';

export interface IPrefereceCompleted extends DefaultResponseParams {
  data?: {
    preference: ICreatePreference;
    key_order: string;
  };
 }
