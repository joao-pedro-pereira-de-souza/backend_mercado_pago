import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("#index", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
  });

   describe("addOrderPending", () => {
        it.todo(
          "There must be an error in the method of adding a pending order"
        );
        it.todo(
          "must carry out the method of adding a pending order and contain all parameters correctly"
        );
        it.todo("must create a backorder for a normal product");
        it.todo("must create a backorder for a product with options");
   });

   describe('getOrdersPending', () => {
      it.todo("should return no key when searching for keys in redis");
      it.todo(
        "must return null in the mGet search and return an empty array in the method"
      );
      it.todo("must return success in the method call");
   })
});
