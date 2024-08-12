import * as redis from "redis";
import { RedisClientType } from "redis";
import logger from '@configs/logger';

class RedisService {
  client!: RedisClientType;
  connection: string;
  constructor(connection: string) {
    this.connection = connection;
  }

  async init() {
    this.client = redis.createClient({
      url: this.connection,
    });

    this.client.once("error", (error) => {
      const response = {
        success: false,
        message: "Ocorreu un erro ao conectar no banco de dados cache.",
        error,
      };
      logger.error({ data: response });

    });

    this.client.once("connect", () => {
      const response = {
        success: true,
        message: "serviço de cache conectado com sucesso!",
      };

      logger.info("serviço de cache conectado com sucesso! ✅", {
        data: response,
      });
    });

    await this.client.connect();

  }
}


export default new RedisService(
  `redis://default:${process.env.DB_REDIS_PASSWORD}@${process.env.DB_REDIS_HOST}:${process.env.DB_REDIS_PORT}`
);
