import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("#services/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should retorn error "Produto não encontrado" ', async () => {
    const { default: moduleProductService } = await import(
      "@services/products.service"
    );

    jest.spyOn(moduleProductService, "validationOrder");
    const mockProduct: any = null;
    const mockOrder = {
      amount: 10,
      id_product: "d36fa868-e898-4494-ac34-080864e850f0",
    };

    const response = await moduleProductService.validationOrder(
      mockProduct,
      mockOrder
    );

    const expected = {
      success: false,
      message: "Produto não encontrado",
      error: new Error("Produto não encontrado"),
    };
    expect(response).toStrictEqual(expected);
  });

  it('should retorn error "O seu pedido cedeu a quantidade de produto disponível."', async () => {
    const { default: orderService } = await import("@services/order_service");
    jest.spyOn(orderService, "getTotalOrdersPending").mockResolvedValue(0);

    const { default: moduleProductService } = await import(
      "@services/products.service"
    );

    jest.spyOn(moduleProductService, "validationOrder");

    const mockProduct: any = {
      id: "d36fa868-e898-4494-ac34-080864e850f0",
      title: null,
      description: null,
      type: "product_bee",
      image: null,
      value: null,
      id_item_mercado_pago: null,
      deleted_at: null,
      option: {
        id: "a6cc4b84-49ad-4955-8ec9-9c2060df976e",
        image: "http://localhost:3001/assets/images/abelha-jandaira.jpg",
        title: "Abelha Jandaira",
        value: 30,
        amount: 1,
        id_product: "d36fa868-e898-4494-ac34-080864e850f0",
        description:
          "A loja especializada em produtos relacionados à apicultura oferece uma variedade de itens artesanais, incluindo colmeias, potes de mel e abelhas. Com um enfoque em produtos de qualidade e produção caseira, os clientes podem encontrar uma seleção diversificada de colmeias feitas à mão, projetadas para atender às necessidades de diferentes tipos de apicultores, desde iniciantes até experientes.Além disso, a loja oferece uma ampla gama de potes de mel, variando em tamanhos, formas e estilos, todos produzidos com ingredientes naturais e cuidadosamente selecionados. Esses potes de mel são ideais tanto para uso pessoal quanto para presentear, garantindo a autenticidade e a qualidade do produto.",
      },
    };
    const mockOrder = {
      amount: 10,
      id_product: "d36fa868-e898-4494-ac34-080864e850f0",
    };

    const response = await moduleProductService.validationOrder(
      mockProduct,
      mockOrder
    );

    const expected = {
      success: false,
      message: "O seu pedido cedeu a quantidade de produto disponível.",
      error: new Error(
        "O seu pedido cedeu a quantidade de produto disponível."
      ),
    };
    expect(response).toStrictEqual(expected);
  });

  it('should retorn error "Produto indisponível devido a pedidos pendentes."', async () => {
    const { default: orderService } = await import("@services/order_service");
    jest.spyOn(orderService, "getTotalOrdersPending").mockResolvedValue(15);

    const { default: moduleProductService } = await import(
      "@services/products.service"
    );

    jest.spyOn(moduleProductService, "validationOrder");

    const mockProduct: any = {
      id: "d36fa868-e898-4494-ac34-080864e850f0",
      title: null,
      description: null,
      type: "product_bee",
      image: null,
      value: null,
      id_item_mercado_pago: null,
      deleted_at: null,
      option: {
        id: "a6cc4b84-49ad-4955-8ec9-9c2060df976e",
        image: "http://localhost:3001/assets/images/abelha-jandaira.jpg",
        title: "Abelha Jandaira",
        value: 30,
        amount: 15,
        id_product: "d36fa868-e898-4494-ac34-080864e850f0",
        description:
          "A loja especializada em produtos relacionados à apicultura oferece uma variedade de itens artesanais, incluindo colmeias, potes de mel e abelhas. Com um enfoque em produtos de qualidade e produção caseira, os clientes podem encontrar uma seleção diversificada de colmeias feitas à mão, projetadas para atender às necessidades de diferentes tipos de apicultores, desde iniciantes até experientes.Além disso, a loja oferece uma ampla gama de potes de mel, variando em tamanhos, formas e estilos, todos produzidos com ingredientes naturais e cuidadosamente selecionados. Esses potes de mel são ideais tanto para uso pessoal quanto para presentear, garantindo a autenticidade e a qualidade do produto.",
      },
    };
    const mockOrder = {
      amount: 10,
      id_product: "d36fa868-e898-4494-ac34-080864e850f0",
    };

    const response = await moduleProductService.validationOrder(
      mockProduct,
      mockOrder
    );

    const expected = {
      success: false,
      message: "Produto indisponível devido a pedidos pendentes.",
      error: new Error("Produto indisponível devido a pedidos pendentes."),
    };
    expect(response).toStrictEqual(expected);
  });

  it("should return success", async () => {
    const { default: orderService } = await import("@services/order_service");
    jest.spyOn(orderService, "getTotalOrdersPending").mockResolvedValue(15);

    const { default: moduleProductService } = await import(
      "@services/products.service"
    );

    jest.spyOn(moduleProductService, "validationOrder");

    const mockProduct: any = {
      id: "d36fa868-e898-4494-ac34-080864e850f0",
      title: null,
      description: null,
      type: "product_bee",
      image: null,
      value: null,
      id_item_mercado_pago: null,
      deleted_at: null,
      option: {
        id: "a6cc4b84-49ad-4955-8ec9-9c2060df976e",
        image: "http://localhost:3001/assets/images/abelha-jandaira.jpg",
        title: "Abelha Jandaira",
        value: 30,
        amount: 150,
        id_product: "d36fa868-e898-4494-ac34-080864e850f0",
        description:
          "A loja especializada em produtos relacionados à apicultura oferece uma variedade de itens artesanais, incluindo colmeias, potes de mel e abelhas. Com um enfoque em produtos de qualidade e produção caseira, os clientes podem encontrar uma seleção diversificada de colmeias feitas à mão, projetadas para atender às necessidades de diferentes tipos de apicultores, desde iniciantes até experientes.Além disso, a loja oferece uma ampla gama de potes de mel, variando em tamanhos, formas e estilos, todos produzidos com ingredientes naturais e cuidadosamente selecionados. Esses potes de mel são ideais tanto para uso pessoal quanto para presentear, garantindo a autenticidade e a qualidade do produto.",
      },
    };
    const mockOrder = {
      amount: 10,
      id_product: "d36fa868-e898-4494-ac34-080864e850f0",
    };

    const response = await moduleProductService.validationOrder(
      mockProduct,
      mockOrder
    );

    expect(response.success).toEqual(true);
  });
});
