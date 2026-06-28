const validarPedido = require("../utils/validarPedido");

describe("Validación de pedido", () => {
  it("debe devolver true cuando el pedido tiene productos válidos", () => {
    const productos = [
      { productoId: "123abc", cantidad: 5 }
    ];

    expect(validarPedido(productos)).toBe(true);
  });

  it("debe devolver false cuando el pedido no tiene productos", () => {
    expect(validarPedido([])).toBe(false);
  });

  it("debe devolver false cuando productos no es un array", () => {
    expect(validarPedido(null)).toBe(false);
  });

  it("debe devolver false cuando la cantidad es cero", () => {
    const productos = [
      { productoId: "123abc", cantidad: 0 }
    ];

    expect(validarPedido(productos)).toBe(false);
  });

  it("debe devolver false cuando falta el productoId", () => {
    const productos = [
      { cantidad: 3 }
    ];

    expect(validarPedido(productos)).toBe(false);
  });
});