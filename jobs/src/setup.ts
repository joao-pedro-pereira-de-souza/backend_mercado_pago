import "dotenv/config";
import redisService from "@services/redis_service";
import bull from "@configs/bull";
import logger from "./configs/logger";
import ProvidersHttp from '@root/src/providers/serverhttp';

class Main {
  async init() {
    try {
      await redisService.init();
      bull.process();

      ProvidersHttp.http();
      debugger
    } catch (error) {
      const response = {
        success: false,
        message: "Ocorreu um erro ao inicializar o sistema de jobs! 🟥",
        error,
      };
      logger.error(response.message, { data: response });
    }
  }
}

 export default new Main();
