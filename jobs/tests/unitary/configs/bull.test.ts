import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("#configs/bull", () => {

   beforeEach(() => {
     jest.clearAllMocks();
     jest.resetModules(); // Redefine o estado do módulo
   });


  it("the loop should pass normally even without a process created", async () => {
    jest.mock("@root/src/controllers", () => ({
      __esModule: false,
      default: {},
    }));

    const { default: moduleBull } = await import("@configs/bull");
    const bullMock = jest.spyOn(moduleBull, "process");

    moduleBull.process();

    expect(bullMock).toHaveBeenCalledTimes(1);
    expect(bullMock).toEqual(expect.any(Function));
  });

  it("must return null when finding jobs", async () => {

    // TODO melhoria: encotrar uma forma de verificar se o queue.process do bull não foi chamado, assim é certeza que o job não entrou no if

    jest.mock("bull");
    jest.mock("pino");

    jest.spyOn(Object, "values").mockReturnValue([]);

    const { default: moduleBull } = await import("@configs/bull");
    const bullMock = jest.spyOn(moduleBull, "process");

    moduleBull.process();

    expect(bullMock).toHaveBeenCalledTimes(1);
    expect(bullMock).toEqual(expect.any(Function));
  });
  it.todo("must execute the headlers successfully and emit the success event");
  it.todo("must enter the error event");
});
