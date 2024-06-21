import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("#index", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

       const { default: moduleLogger } = await import("@configs/logger");
       jest.spyOn(moduleLogger, "error").mockImplementation(()=> {});
  });

  it("should start the module successfully", async () => {
    jest.mock("@configs/bull");
    const { default: moduleBull } = await import("@configs/bull");
    const bullMock = jest.spyOn(moduleBull, "process");

    const { default: moduleRedisService } = await import(
      "@services/redis_service"
    );
    const redisServiceMock = jest
      .spyOn(moduleRedisService, "init")
      .mockResolvedValue();

    const { default: moduleSetup } = await import("@root/src/setup");
    const setupMock = jest.spyOn(moduleSetup, "init");

    await import("@root/src/index");

    expect(setupMock).toHaveBeenCalledTimes(1);
    expect(redisServiceMock).toHaveBeenCalledTimes(1);
    expect(bullMock).toHaveBeenCalledTimes(1);
  });

  it("should start the module error init", async () => {

   const {default: moduleLogger} = await import('@configs/logger');
   jest.spyOn(moduleLogger, 'error')

    const { default: moduleRedisService } = await import(
      "@services/redis_service"
    );
    jest.spyOn(moduleRedisService, "init").mockResolvedValueOnce();

    const { default: moduleBull } = await import("@configs/bull");
    jest.spyOn(moduleBull, "process").mockReturnValue();

     const { default: moduleSetup } = await import("@root/src/setup");

      jest
       .spyOn(moduleSetup, "init")
       .mockImplementationOnce(async () => {
         try {
          throw new Error("Initialization error");
         } catch (error) {
           const response = {
             success: false,
             message: "Ocorreu um erro ao inicializar o sistema de jobs! 🟥",
             error,
           };
           moduleLogger.error(response.message, { data: response });
         }
       });

    await import("@root/src/index");

     expect(moduleLogger.error).toHaveBeenCalledWith(
       "Ocorreu um erro ao inicializar o sistema de jobs! 🟥",
       {
         data: {
           success: false,
           message: "Ocorreu um erro ao inicializar o sistema de jobs! 🟥",
           error: new Error("Initialization error"),
         },
       }
     );
  });

  it("should start the module error child redis init", async () => {
    jest.mock("redis", () => {
      const mClient = {
        connect: jest.fn(),
        once: jest.fn(),
      };
      return {
        createClient: jest.fn(() => mClient),
      };
    });

    const { default: logger } = await import("@configs/logger");
    const logErrorMock = jest.spyOn(logger, "error");

    jest.mock("@configs/bull");

    const { createClient } = require("redis");
    const mClient = createClient();

    const error = new Error("Connection error");
    mClient.connect.mockImplementation(async () => {
      mClient.once.mock.calls.forEach(
        ([event, callback]: [string, Function]) => {
          if (event === "error") {
            callback(error);
          }
        }
      );
    });

    await import("@root/src/index");

    expect(logErrorMock).toHaveBeenCalledTimes(1);
    const loggerError = {
      data: {
        success: false,
        message: "Ocorreu un erro ao conectar no banco de dados cache.",
        error: expect.any(Error),
      },
    };
    expect(logErrorMock).toHaveBeenNthCalledWith(1, loggerError);
  });

  it("should start the module error child job", async () => {
      const { default: logger } = await import("@configs/logger");
      const logErrorMock = jest.spyOn(logger, "error");
    process.env.DB_REDIS_PASSWORD = "senha123";
    process.env.DB_REDIS_HOST = "redis-cache";
    process.env.DB_REDIS_PORT = "6432";

    const { default: moduleRedisService } = await import(
      "@services/redis_service"
    );
    jest.spyOn(moduleRedisService, "init").mockImplementation(async () => {});

    const { default: moduleBull } = await import("@configs/bull");
    jest.spyOn(moduleBull, "process").mockImplementation(() => {
      throw new Error("mock error");
    });

    await import("@root/src/index");

    expect(logErrorMock).toHaveBeenCalledTimes(1);
    const loggerError = {
      data: {
        success: false,
        message: "Ocorreu um erro ao inicializar o sistema de jobs! 🟥",
        error: new Error("mock error"),
      },
    };
    expect(logErrorMock).toHaveBeenNthCalledWith(1, loggerError.data.message, loggerError);
  });
});
