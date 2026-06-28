const Pedido = require("../models/Pedido");
const Franquicia = require("../models/Franquicia");
const Producto = require("../models/Producto");

function getUsuario(req) {
  return req.user || req.session?.usuario || req.session?.user || null;
}

function getRol(req) {
  const usuario = getUsuario(req);
  return usuario?.role || usuario?.rol || null;
}

function esAdmin(req) {
  const rol = getRol(req);
  return rol === "admin" || rol === "administrador";
}

function getFranquiciaUsuario(req) {
  const usuario = getUsuario(req);
  return usuario?.franquiciaId || usuario?.franquicia || null;
}

function valorId(valor) {
  if (!valor) return "";
  if (typeof valor === "object") {
    return String(valor._id || valor.id || "");
  }
  return String(valor);
}

function getIdFranquiciaPedido(pedido) {
  return valorId(pedido?.franquiciaId);
}

function puedeAcceder(req, pedido) {
  if (esAdmin(req)) return true;

  const franquiciaUsuario = getFranquiciaUsuario(req);

  // Si no hay franquicia cargada en el usuario, no permitimos ver pedidos ajenos.
  if (!franquiciaUsuario) return false;

  return getIdFranquiciaPedido(pedido) === valorId(franquiciaUsuario);
}

function normalizarProductos(productos) {
  if (!productos) return [];

  let lista = productos;

  if (!Array.isArray(lista) && typeof lista === "object") {
    lista = Object.values(lista);
  }

  if (!Array.isArray(lista)) {
    return [];
  }

  return lista
    .map((item) => ({
      productoId: item.productoId,
      cantidad: Number(item.cantidad)
    }))
    .filter((item) => item.productoId && item.cantidad > 0);
}

async function obtenerTodosLosPedidos() {
  if (typeof Pedido.find === "function") {
    return await Pedido.find()
      .populate("franquiciaId")
      .populate("productos.productoId")
      .lean();
  }

  return [];
}

async function obtenerPedidoPorId(id) {
  if (typeof Pedido.findById === "function") {
    return await Pedido.findById(id)
      .populate("franquiciaId")
      .populate("productos.productoId")
      .lean();
  }

  return null;
}

async function agregarNombreFranquicia(pedidos) {
  const franquicias = await Franquicia.find().lean();

  const mapaFranquicias = new Map();

  franquicias.forEach((franquicia) => {
    if (franquicia._id) mapaFranquicias.set(String(franquicia._id), franquicia);
    if (franquicia.id) mapaFranquicias.set(String(franquicia.id), franquicia);
  });

  return pedidos.map((pedido) => {
    let franquiciaEncontrada = null;

    if (pedido.franquiciaId && typeof pedido.franquiciaId === "object") {
      franquiciaEncontrada = pedido.franquiciaId;
    } else {
      franquiciaEncontrada = mapaFranquicias.get(String(pedido.franquiciaId));
    }

    const franquiciaNombre =
      franquiciaEncontrada?.razonSocial ||
      franquiciaEncontrada?.nombre ||
      franquiciaEncontrada?.nombreFantasia ||
      "No asignado";

    return {
      ...pedido,
      franquiciaIdOriginal: pedido.franquiciaId,
      franquiciaId: franquiciaEncontrada || pedido.franquiciaId,
      franquiciaNombre
    };
  });
}

// LISTAR PEDIDOS
const getAllPedidos = async (req, res) => {
  try {
    let pedidos = await obtenerTodosLosPedidos();

    // Si es admin ve todos. Si es operario, solo ve los pedidos de su franquicia.
    pedidos = pedidos.filter((pedido) => puedeAcceder(req, pedido));

    pedidos = await agregarNombreFranquicia(pedidos);

    res.format({
      json: () => res.json(pedidos),
      html: () =>
        res.render("pedidos", {
          title: "Pedidos",
          pedidos
        })
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// VER DETALLE
// VER DETALLE
const getPedidoById = async (req, res) => {
  try {
    let pedido = await obtenerPedidoPorId(req.params.id);

    if (!pedido) {
      return res.status(404).send("Pedido no encontrado");
    }

    if (!puedeAcceder(req, pedido)) {
      return res.status(403).send("Acceso denegado. Este pedido pertenece a otra sucursal.");
    }

    const pedidosConFranquicia = await agregarNombreFranquicia([pedido]);
    pedido = pedidosConFranquicia[0];

    // Buscamos todos los pedidos que puede ver este usuario para calcular el número visible
    let todosLosPedidos = await obtenerTodosLosPedidos();

    todosLosPedidos = todosLosPedidos.filter((p) => puedeAcceder(req, p));

    const indicePedido = todosLosPedidos.findIndex((p) => {
      const idPedidoLista = String(p._id || p.id || "");
      const idPedidoActual = String(pedido._id || pedido.id || "");

      return idPedidoLista === idPedidoActual;
    });

    pedido.numeroPedido = indicePedido >= 0 ? indicePedido + 1 : null;

    res.format({
      json: () => res.json(pedido),
      html: () =>
        res.render("pedidoDetalle", {
          title: "Detalle del Pedido",
          pedido
        })
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// FORMULARIO NUEVO
const renderNewForm = async (req, res) => {
  try {
    let franquicias = [];

    // Admin ve todas, operario solo la suya
    if (esAdmin(req)) {
      franquicias = await Franquicia.find().lean();
    } else {
      const franquiciaUsuario = getFranquiciaUsuario(req);

      if (!franquiciaUsuario) {
        return res.status(403).send("No tenés una franquicia asignada para crear pedidos.");
      }

      franquicias = await Franquicia.find({ _id: franquiciaUsuario }).lean();
    }

    const productos = await Producto.find().lean();

    res.render("pedidoForm", {
      title: "Nuevo pedido",
      isEdit: false,
      pedido: null,
      franquicias,
      productos
    });
  } catch (error) {
    console.error("Error al cargar formulario:", error);
    res.status(500).send("Error al cargar formulario");
  }
};

// FORMULARIO EDITAR
const renderEditForm = async (req, res) => {
  try {
    let pedido = await obtenerPedidoPorId(req.params.id);

    if (!pedido) {
      return res.status(404).send("Pedido no encontrado");
    }

    if (!puedeAcceder(req, pedido)) {
      return res.status(403).send("Acceso denegado a este pedido");
    }

    const pedidosConFranquicia = await agregarNombreFranquicia([pedido]);
    pedido = pedidosConFranquicia[0];

    let franquicias = [];

    // Admin ve todas, operario solo la suya
    if (esAdmin(req)) {
      franquicias = await Franquicia.find().lean();
    } else {
      const franquiciaUsuario = getFranquiciaUsuario(req);

      if (!franquiciaUsuario) {
        return res.status(403).send("No tenés una franquicia asignada.");
      }

      franquicias = await Franquicia.find({ _id: franquiciaUsuario }).lean();
    }

    const productos = await Producto.find().lean();

    res.render("pedidoForm", {
      title: "Editar pedido",
      isEdit: true,
      pedido,
      franquicias,
      productos
    });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.status(500).send("Error al cargar formulario de edición");
  }
};

// CREAR PEDIDO
const createPedido = async (req, res) => {
  try {
    const franquiciaId = esAdmin(req)
      ? req.body.franquiciaId
      : getFranquiciaUsuario(req);

    const productos = normalizarProductos(req.body.productos);

    if (!franquiciaId) {
      throw new Error("Debe seleccionar una franquicia.");
    }

    if (productos.length === 0) {
      throw new Error("Debe agregar al menos un producto con cantidad válida.");
    }

    for (const item of productos) {
      const productoFisico = await Producto.findById(item.productoId);

      if (!productoFisico) {
        throw new Error("Un producto seleccionado no existe.");
      }

      if (productoFisico.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente de '${productoFisico.nombre}'. Pediste ${item.cantidad} pero solo quedan ${productoFisico.stock} disponibles.`
        );
      }
    }

    let nuevoPedido;

    if (typeof Pedido.getAll === "function") {
      nuevoPedido = new Pedido(franquiciaId, productos).create();
    } else if (typeof Pedido.create === "function") {
      nuevoPedido = await Pedido.create({
        franquiciaId,
        productos,
        estado: "pendiente",
        fecha: new Date()
      });
    }

    for (const item of productos) {
      await Producto.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad } // Resta la cantidad
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("nuevoPedido", {
        mensaje: "Nuevo pedido recibido",
        pedidoId: nuevoPedido?._id || nuevoPedido?.id,
        estado: nuevoPedido?.estado,
        fecha: nuevoPedido?.fecha
      });
    }

    res.format({
      json: () => res.status(201).json(nuevoPedido),
      html: () => res.redirect("/pedidos")
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);

    res.format({
      json: () => res.status(400).json({ error: error.message }),
      html: () =>
        res.status(400).send(`
          <article style="padding:2rem; text-align:center; color:red;">
            <h2>Operación denegada</h2>
            <p>${error.message}</p>
            <a href="/pedidos/nuevo" role="button">Volver al formulario</a>
          </article>
        `)
    });
  }
};

// ACTUALIZAR PEDIDO
const updatePedido = async (req, res) => {
  try {
    const pedidoAntiguo = await obtenerPedidoPorId(req.params.id);

    if (!pedidoAntiguo) {
      return res.status(404).send("Pedido no encontrado");
    }

    // Validar que el operario sea dueño de este pedido
    if (!puedeAcceder(req, pedidoAntiguo)) {
      return res.status(403).send("Acceso denegado a este pedido");
    }

    // Evitar que cambien el franquiciaId inyectando datos en req.body
    if (!esAdmin(req)) {
      const franquiciaUsuario = getFranquiciaUsuario(req);

      if (!franquiciaUsuario) {
        return res.status(403).send("No tenés una franquicia asignada.");
      }

      req.body.franquiciaId = franquiciaUsuario;
    }

    const nuevoEstado = req.body.estado;

    // Bloquear transiciones de estado inválidas para operarios
    if (
      !esAdmin(req) &&
      nuevoEstado &&
      !["pendiente", "cancelado"].includes(nuevoEstado)
    ) {
      return res
        .status(403)
        .send("Operación inválida: Solo los administradores pueden pasar pedidos a 'En Proceso' o 'Completado'.");
    }

    if (nuevoEstado && pedidoAntiguo.estado !== "cancelado" && nuevoEstado === "cancelado") {
      for (const item of pedidoAntiguo.productos || []) {
        await Producto.findByIdAndUpdate(item.productoId, {
          $inc: { stock: item.cantidad }
        });
      }
    }

    if (nuevoEstado && pedidoAntiguo.estado === "cancelado" && nuevoEstado !== "cancelado") {
      for (const item of pedidoAntiguo.productos || []) {
        await Producto.findByIdAndUpdate(item.productoId, {
          $inc: { stock: -item.cantidad }
        });
      }
    }

    let updatedPedido;

    if (typeof Pedido.update === "function") {
      updatedPedido = Pedido.update(req.params.id, req.body);
    } else if (typeof Pedido.findByIdAndUpdate === "function") {
      updatedPedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (!updatedPedido) {
      return res.status(404).send("Pedido no encontrado");
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("pedidoActualizado", {
        pedidoId: req.params.id,
        estado: nuevoEstado
      });
    }

    res.format({
      json: () => res.json(updatedPedido),
      html: () => res.redirect("/pedidos")
    });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// ELIMINAR PEDIDO
const deletePedido = async (req, res) => {
  try {
    // Buscar primero para verificar propiedad antes de borrar
    const pedido = await obtenerPedidoPorId(req.params.id);

    if (!pedido) {
      return res.status(404).send("Pedido no encontrado");
    }

    if (!puedeAcceder(req, pedido)) {
      return res.status(403).send("Acceso denegado a este pedido");
    }

    let deleted = false;

    if (typeof Pedido.delete === "function") {
      deleted = Pedido.delete(req.params.id);
    } else if (typeof Pedido.findByIdAndDelete === "function") {
      deleted = await Pedido.findByIdAndDelete(req.params.id);
    }

    if (!deleted) {
      return res.status(404).send("Pedido no encontrado");
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("pedidoEliminado", {
        pedidoId: req.params.id
      });
    }

    res.format({
      json: () => res.status(204).send(),
      html: () => res.redirect("/pedidos")
    });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).send("Error interno");
  }
};

module.exports = {
  getAllPedidos,
  getPedidoById,
  renderNewForm,
  renderEditForm,
  createPedido,
  updatePedido,
  deletePedido
};