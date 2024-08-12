import database from "../database/connection";
import permissions from '@contents/permissions';

export interface QueryFindOptionProductBeeInterface {
  id: string;
  name: string;
  email: string;
  cpf: string;
}

class ClientRepository {
  async findClient(
    id: string,
  ): Promise<QueryFindOptionProductBeeInterface> {
     return (
        await
           database('users AS u')
              .select(['u.id', 'u.name', 'u.email', 'c.cpf'])
              .innerJoin('permissions AS p', 'p.id', 'u.id_permission')
              .innerJoin('clients AS c', 'c.id_user', 'u.id')
              .where('u.id', id)
              .andWhere('p.number', permissions.CLIENT).first()
     ) as QueryFindOptionProductBeeInterface
  }
}

export default new ClientRepository();
