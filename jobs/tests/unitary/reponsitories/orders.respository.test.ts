import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("#repositories/order", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("addOrderPending", () => {
    it.todo("There must be an error in the method of adding a pending order");
    it.todo(
      "must carry out the method of adding a pending order and contain all parameters correctly"
    );
    it.todo("must create a backorder for a normal product");
    it("must create a backorder for a product with options", async () => {
      jest.useFakeTimers({
        now: new Date('2024-07-11 18:50:00'),
      });

      jest.mock("redis", () => jest.requireActual("redis-mock"));

      const { default: moduleRedis } = await import("redis-mock");
      const redisClient = moduleRedis.createClient();
      const setRedisMock = jest.spyOn(redisClient, "set");

      const { default: moduleCrypto } = await import("crypto");
      const mockUUID = "612cab52-9a12-4723-b086-6df603ef99cd";
      jest.spyOn(moduleCrypto, "randomUUID").mockReturnValue(mockUUID);

      const { default: moduleOrderService } = await import('@repositories/orders.repository');

      const paramsNewOrder = {
        id_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        id_option_product: "70f14f7f-10c7-40c7-b4d0-6b2bbc8bcd1c",
        type_product: "product_bee",
      };

      await moduleOrderService.addOrderPending(paramsNewOrder, 10);

      expect(setRedisMock).toHaveBeenCalledWith(1);
    });
  });

  describe("getOrdersPending", () => {
    it.todo("should return no key when searching for keys in redis");
    it.todo(
      "must return null in the mGet search and return an empty array in the method"
    );
    it.todo("must return success in the method call");
  });
});
