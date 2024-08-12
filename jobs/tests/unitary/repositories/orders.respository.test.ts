import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mercadopagoConfigs } from "@configs/mercadopago";

describe("#repositories/order", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  const MOCK_UUID = "612cab52-9a12-4723-b086-6df603ef99cd";
  describe("addOrderPending", () => {
    const MOCK_UUID = "612cab52-9a12-4723-b086-6df603ef99cd";
    const MOCK_RESPONSE_SET_REDIS = "KEY_SET_MOCK";

    async function ConfigMocksRedis() {
      const spies: any = {
        once: jest.fn(),
        connect: jest.fn(),
        set: jest.fn(() => {
          return MOCK_RESPONSE_SET_REDIS;
        }),
      };

      jest.mock("redis", () => {
        const createClient = jest.fn(() => {
          return {
            once: spies.once,
            connect: spies.connect,
            set: spies.set,
          };
        });
        spies.createClient = createClient;

        return {
          createClient,
        };
      });

      return spies;
    }

    async function ConfigMockErrorRedis() {
      const spies: any = {
        once: jest.fn(),
        connect: jest.fn(),
        set: jest.fn(() => {
          throw new Error("ERRO mock");
        }),
      };

      jest.mock("redis", () => {
        const createClient = jest.fn(() => {
          return {
            once: spies.once,
            connect: spies.connect,
            set: spies.set,
          };
        });
        spies.createClient = createClient;

        return {
          createClient,
        };
      });

      return spies;
    }

    it("There must be an error in the method of adding a pending order", async () => {
      const nowFakeTime = new Date("2024-07-11 18:50:00");

      jest.useFakeTimers({
        now: nowFakeTime,
      });

      const mockRedis = await ConfigMockErrorRedis();

      const { default: moduleCrypto } = await import("crypto");
      jest.spyOn(moduleCrypto, "randomUUID").mockReturnValue(MOCK_UUID);

      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      const paramsNewOrder = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        type_product: "product",
      };
      const KEY_INIT_ORDER_NORMAL = `order@${paramsNewOrder.id_product}`;
      const amount_order = 10;

      const response = await moduleOrderService.addOrderPending(
        paramsNewOrder,
        amount_order
      );

      expect(mockRedis.set).toHaveBeenCalledTimes(1);

      const KEY_ORDER = `${KEY_INIT_ORDER_NORMAL}:${MOCK_UUID}`;

      const dataExpectedSet = {
        id_product: paramsNewOrder.id_product,
        amount: amount_order,
        id_order: MOCK_UUID,
        type_product: paramsNewOrder.type_product,
      };
      const expectedParamsSet = {
        id_order: KEY_ORDER,
        data: JSON.stringify(dataExpectedSet),
        config: {
          EX: 60000 * mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES,
        },
      };
      expect(mockRedis.set).toHaveBeenCalledWith(
        expectedParamsSet.id_order,
        expectedParamsSet.data,
        expectedParamsSet.config
      );

      const expectedResponse = {
        success: false,
        message: "Ocorreu um erro ao salvar o pedido pendente.",
        error: new Error("ERRO mock"),
      };
      expect(response).toEqual(expectedResponse);
    });

    it("must carry out the method of adding a pending order and contain all parameters correctly", async () => {
      const nowFakeTime = new Date("2024-07-11 18:50:00");
      const endFakeTime = new Date("2024-07-11 19:00:00");

      jest.useFakeTimers({
        now: nowFakeTime,
      });

      const mockRedis = await ConfigMocksRedis();

      const { default: moduleCrypto } = await import("crypto");
      jest.spyOn(moduleCrypto, "randomUUID").mockReturnValue(MOCK_UUID);

      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      const paramsNewOrder = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        type_product: "product",
      };
      const KEY_INIT_ORDER_NORMAL = `order@${paramsNewOrder.id_product}`;
      const amount_order = 10;

      const response = await moduleOrderService.addOrderPending(
        paramsNewOrder,
        amount_order
      );

      expect(mockRedis.set).toHaveBeenCalledTimes(1);

      const KEY_ORDER = `${KEY_INIT_ORDER_NORMAL}:${MOCK_UUID}`;

      const dataExpectedSet = {
        id_product: paramsNewOrder.id_product,
        amount: amount_order,
        id_order: MOCK_UUID,
        type_product: paramsNewOrder.type_product,
      };
      const expectedParamsSet = {
        id_order: KEY_ORDER,
        data: JSON.stringify(dataExpectedSet),
        config: {
          EX: 60000 * mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES,
        },
      };
      expect(mockRedis.set).toHaveBeenCalledWith(
        expectedParamsSet.id_order,
        expectedParamsSet.data,
        expectedParamsSet.config
      );

      const expectedResponse = {
        success: true,
        data: {
          redis: MOCK_RESPONSE_SET_REDIS,
          key: KEY_ORDER,
          expiration: {
            start: nowFakeTime.toISOString(),
            end: endFakeTime.toISOString(),
          },
        },
      };

      expect(response).toEqual(expectedResponse);
    });

    it("must create a backorder for a normal product", async () => {
      const nowFakeTime = new Date("2024-07-11 18:50:00");

      jest.useFakeTimers({
        now: nowFakeTime,
      });

      const mockRedis = await ConfigMocksRedis();

      const { default: moduleCrypto } = await import("crypto");
      jest.spyOn(moduleCrypto, "randomUUID").mockReturnValue(MOCK_UUID);

      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      const paramsNewOrder = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        type_product: "product",
      };
      const KEY_INIT_ORDER_NORMAL = `order@${paramsNewOrder.id_product}`;
      const amount_order = 10;

      await moduleOrderService.addOrderPending(paramsNewOrder, amount_order);

      expect(mockRedis.set).toHaveBeenCalledTimes(1);

      const KEY_ORDER = `${KEY_INIT_ORDER_NORMAL}:${MOCK_UUID}`;

      const dataExpectedSet = {
        id_product: paramsNewOrder.id_product,
        amount: amount_order,
        id_order: MOCK_UUID,
        type_product: paramsNewOrder.type_product,
      };
      const expectedParamsSet = {
        id_order: KEY_ORDER,
        data: JSON.stringify(dataExpectedSet),
        config: {
          EX: 60000 * mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES,
        },
      };
      expect(mockRedis.set).toHaveBeenCalledWith(
        expectedParamsSet.id_order,
        expectedParamsSet.data,
        expectedParamsSet.config
      );
    });

    it("must create a backorder for a product with options", async () => {
      jest.useFakeTimers({
        now: new Date("2024-07-11 18:50:00"),
      });

      const mockRedis = await ConfigMocksRedis();

      const { default: moduleCrypto } = await import("crypto");
      jest.spyOn(moduleCrypto, "randomUUID").mockReturnValue(MOCK_UUID);

      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      const paramsNewOrder = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        id_option_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        type_product: "product_bee",
      };
      const KEY_INIT_ORDER_OPTION = `order@${paramsNewOrder.id_product}@option=${paramsNewOrder.id_option_product}`;
      const amount_order = 10;

      await moduleOrderService.addOrderPending(paramsNewOrder, amount_order);

      expect(mockRedis.set).toHaveBeenCalledTimes(1);

      const dataExpectedSet = {
        id_product: paramsNewOrder.id_product,
        amount: amount_order,
        id_order: MOCK_UUID,
        type_product: paramsNewOrder.type_product,
        id_option_product: paramsNewOrder.id_option_product,
      };
      const expectedParamsSet = {
        id_order: `${KEY_INIT_ORDER_OPTION}:${MOCK_UUID}`,
        data: JSON.stringify(dataExpectedSet),
        config: {
          EX: 60000 * mercadopagoConfigs.PREFERENCE.EXPIRATION_TIME_MINUTES,
        },
      };
      expect(mockRedis.set).toHaveBeenCalledWith(
        expectedParamsSet.id_order,
        expectedParamsSet.data,
        expectedParamsSet.config
      );
    });
  });

  describe("getOrdersPending", () => {
    async function ConfigMocksRedis(
      dataMockKeys: string[] | null,
      dataMockMGet: (string | null)[]
    ) {
      const spies: any = {
        once: jest.fn(),
        connect: jest.fn(),
        keys: jest.fn(() => {
          return dataMockKeys;
        }),
        mGet: jest.fn(() => {
          return dataMockMGet;
        }),
      };

      jest.mock("redis", () => {
        const createClient = jest.fn(() => {
          return {
            once: spies.once,
            connect: spies.connect,
            keys: spies.keys,
            mGet: spies.mGet,
          };
        });
        spies.createClient = createClient;

        return {
          createClient,
        };
      });

      return spies;
    }

    it("should return no key when searching for keys in redis", async () => {
      const dataMockKeys = new Array();
      const dataMockMGet = new Array();
      const mockRedis = await ConfigMocksRedis(dataMockKeys, dataMockMGet);
      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      const paramsGetOrdersPending = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
      };
      const response = await moduleOrderService.getOrdersPending(
        paramsGetOrdersPending.id_product
      );

      expect(mockRedis.keys).toHaveBeenCalledTimes(1);
      expect(mockRedis.mGet).toHaveBeenCalledTimes(0);

      expect(response).toEqual([]);
    });

    it("must return null in the mGet search and return an empty array in the method", async () => {
      const paramsGetOrdersPending = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
      };
      const KEY_INIT_ORDER_NORMAL = `order@${paramsGetOrdersPending.id_product}`;
      const dataMockKeys = [KEY_INIT_ORDER_NORMAL];
      const dataMockMGet = new Array();

      const mockRedis = await ConfigMocksRedis(dataMockKeys, dataMockMGet);
      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      await moduleOrderService.getOrdersPending(
        paramsGetOrdersPending.id_product
      );

      expect(mockRedis.keys).toHaveBeenCalledTimes(1);
      expect(mockRedis.mGet).toHaveBeenCalledTimes(1);

      const resultMGet = mockRedis.mGet.mock.results[0].value;
      expect(resultMGet).toEqual([]);
    });

    it("must return success in the method call", async () => {
      const paramsGetOrdersPending = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
      };
      const KEY_INIT_ORDER_NORMAL = `order@${paramsGetOrdersPending.id_product}`;
      const dataMockKeys = [KEY_INIT_ORDER_NORMAL];

      const dataValuesCachesMock = [
        {
          id_product: paramsGetOrdersPending.id_product,
          amount: 10,
          id_order: MOCK_UUID,
          type_product: "product",
        },
      ];

      const dataMockMGet = [JSON.stringify(dataValuesCachesMock[0])];

      const mockRedis = await ConfigMocksRedis(dataMockKeys, dataMockMGet);
      const { default: moduleServiceRedis } = await import(
        "@services/redis_service"
      );

      await moduleServiceRedis.init();
      const { default: moduleOrderService } = await import(
        "@repositories/orders.repository"
      );

      const response = await moduleOrderService.getOrdersPending(
        paramsGetOrdersPending.id_product
      );

      expect(mockRedis.keys).toHaveBeenCalledTimes(1);
      expect(mockRedis.mGet).toHaveBeenCalledTimes(1);

      const resultMGet = mockRedis.mGet.mock.results[0].value;
      expect(resultMGet).toEqual([JSON.stringify(dataValuesCachesMock[0])]);
      expect(response).toEqual([JSON.stringify(dataValuesCachesMock[0])]);
    });
  });
});
