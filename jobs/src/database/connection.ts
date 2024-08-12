import knex from 'knex';
import knexConfig from '../configs/knexConfigs';


export default knex(
  process.env.NODE_ENV === "production"
    ? knexConfig.production
    : knexConfig.development
);
