import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { RedisClientType } from "redis";

describe("#services/orders", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should return 0 getTotalOrdersPending", async () => {
    const { default: moduleRedisService } = await import(
      "@repositories/orders.repository"
    );

    jest.spyOn(moduleRedisService, "getOrdersPending").mockResolvedValue([]);

    const { default: moduleOrdersService } = await import(
      "@services/order_service"
    );

    const params = {
      id_product: "",
      id_option_product: "",
    };
    const respose = await moduleOrdersService.getTotalOrdersPending(params);

    expect(respose).toEqual(0);
  });

  it("should return successfully getTotalOrdersPending", async () => {
    const mockDataOrderMock = {
      id_product: "d36fa868-e898-4494-ac34-080864e850f0",
      amount: 10,
      id_order: "d36fa868-e898-4494-ac34-080864e850f0",
      type_product: "",
      id_option_product: "d36fa868-e898-4494-ac34-080864e850f0",
    };

    const mockDataOrderMock02 = {
      id_product: "d36fa868-e898-4494-ac34-080864e850f0",
      amount: 10,
      id_order: "d36fa868-e898-4494-ac34-080864e850f0",
      type_product: "",
      id_option_product: "d36fa868-e898-4494-ac34-080864e850f0",
    };
    const { default: moduleRedisService } = await import(
      "@repositories/orders.repository"
    );

    jest
      .spyOn(moduleRedisService, "getOrdersPending")
      .mockResolvedValue([
        JSON.stringify(mockDataOrderMock),
        JSON.stringify(mockDataOrderMock02),
      ]);

    const { default: moduleOrdersService } = await import(
      "@services/order_service"
    );

    const params = {
      id_product: "",
      id_option_product: "",
    };
    const respose = await moduleOrdersService.getTotalOrdersPending(params);

    const totalExpected = mockDataOrderMock.amount + mockDataOrderMock02.amount;
    expect(respose).toEqual(totalExpected);
  });
});
