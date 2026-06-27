const socket = io();

socket.on("nuevoPedido", function () {
  const alerta = document.getElementById("pedido-alerta");

  if (alerta) {
    alerta.textContent = "Nuevo pedido recibido. Actualizando listado...";
    alerta.style.display = "block";
  }

  setTimeout(function () {
    window.location.reload();
  }, 1200);
});
