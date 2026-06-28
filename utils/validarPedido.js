function validarPedido(productos) {
  if (!Array.isArray(productos)) {
    return false;
  }

  if (productos.length === 0) {
    return false;
  }

  const productosValidos = productos.filter((item) => {
    return item.productoId && Number(item.cantidad) > 0;
  });

  return productosValidos.length > 0;
}

module.exports = validarPedido;