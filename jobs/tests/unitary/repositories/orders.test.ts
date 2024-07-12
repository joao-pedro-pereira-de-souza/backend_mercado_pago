import { describe, it, expect, jest, beforeEach } from "@jest/globals";
// import { RedisClientType } from "redis";
import redisMock from "redis-mock";

describe("#services/orders", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should return [] in keys", async () => {
    jest.mock("redis", () => redisMock);

    const { default: redis } = await import("redis");
    jest.spyOn(redis.createClient(), "keys").mockResolvedValue([]);

    const { default: moduleOrdersRepository } = await import(
      "@repositories/orders.repository"
    );

    const response = await moduleOrdersRepository.getOrdersPending(
      "d36fa868-e898-4494-ac34-080864e850f0",
      "d36fa868-e898-4494-ac34-080864e850f0"
    );

    expect(response).toEqual([]);
  });

  it("should return undefined in keys", async () => {
    jest.mock("redis", () => redisMock);

    const { default: redis } = await import("redis");
    jest.spyOn(redis.createClient(), "keys").mockResolvedValue(undefined);

    const { default: moduleOrdersRepository } = await import(
      "@repositories/orders.repository"
    );

    const response = await moduleOrdersRepository.getOrdersPending(
      "d36fa868-e898-4494-ac34-080864e850f0",
      "d36fa868-e898-4494-ac34-080864e850f0"
    );

    expect(response).toEqual([]);
  });

  it.todo("should return result successfully mGet");
});
