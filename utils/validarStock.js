function validarStock(stockDisponible, cantidadSolicitada) {
  const cantidadValida = cantidadSolicitada > 0;
  const hayStock = stockDisponible >= cantidadSolicitada;

  if (!cantidadValida) return false;
  if (!hayStock) return false;

  return true;
}

module.exports = validarStock;