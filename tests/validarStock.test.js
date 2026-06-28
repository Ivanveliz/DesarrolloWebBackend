const validarStock = require("../utils/validarStock");

describe("Validación de stock", () => {
  it("debe devolver true cuando hay stock suficiente", () => {
    expect(validarStock(10, 5)).toBe(true);
  });

  it("debe devolver false cuando la cantidad supera el stock", () => {
    expect(validarStock(3, 5)).toBe(false);
  });

  it("debe devolver false cuando la cantidad solicitada es cero", () => {
    expect(validarStock(10, 0)).toBe(false);
  });

  it("debe devolver false cuando la cantidad solicitada es negativa", () => {
    expect(validarStock(10, -2)).toBe(false);
  });
});