const Pedido = require('../models/Pedido');
const Franquicia = require('../models/Franquicia');
const Producto = require('../models/Producto');

const getAllPedidos = async (req, res) => {
    try {
        // Si no es admin, filtra estrictamente por el franquiciaId inyectado en el JWT
        const filtro = req.user.role === 'admin' ? {} : { franquiciaId: req.user.franquiciaId };

        const pedidos = await Pedido.find(filtro).populate('franquiciaId');

        res.format({
            json: () => res.json(pedidos),
            html: () => res.render("pedidos", { pedidos })
        });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};

const getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id)
            .populate('franquiciaId')
            .populate('productos.productoId');

        if (!pedido) {
            return res.format({
                json: () => res.status(404).json({ error: "Pedido no encontrado" }),
                html: () => res.status(404).send("Pedido no encontrado")
            });
        }

        // Si no es admin y el franquiciaId del pedido NO coincide con el del empleado
        if (req.user.role !== 'admin' && pedido.franquiciaId._id.toString() !== req.user.franquiciaId.toString()) {
            return res.format({
                json: () => res.status(403).json({ error: "Acceso denegado. Este pedido pertenece a otra sucursal." }),
                html: () => res.status(403).send("Acceso denegado. Este pedido pertenece a otra sucursal.")
            });
        }

        res.format({
            json: () => res.json(pedido),
            html: () => res.render("pedidoDetalle", { pedido })
        });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};

const renderNewForm = async (req, res) => {
    try {
        // Admin ve todas, operario solo la suya
        const filtroFranquicia = req.user.role === 'admin' ? {} : { _id: req.user.franquiciaId };

        const franquicias = await Franquicia.find(filtroFranquicia);
        const productos = await Producto.find();

        res.render("pedidoForm", { isEdit: false, pedido: null, franquicias, productos });
    } catch (error) {
        res.status(500).send("Error al cargar formulario");
    }
};

const renderEditForm = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).send("Pedido no encontrado");

        const filtroFranquicia = req.user.role === 'admin' ? {} : { _id: req.user.franquiciaId };

        const franquicias = await Franquicia.find(filtroFranquicia);
        const productos = await Producto.find();

        res.render("pedidoForm", { isEdit: true, pedido, franquicias, productos });
    } catch (error) {
        res.status(500).send("Error al cargar formulario de edición");
    }
};


const createPedido = async (req, res) => {
    try {
        const { franquiciaId, productos } = req.body;

        if (req.user.role !== 'admin') {
            req.body.franquiciaId = req.user.franquiciaId;
        }

        for (let item of productos) {
            const productoFisico = await Producto.findById(item.productoId);
            if (!productoFisico) throw new Error("Un producto seleccionado no existe.");

            if (productoFisico.stock < item.cantidad) {
                throw new Error(`Stock insuficiente de '${productoFisico.nombre}'. Pediste ${item.cantidad} pero solo quedan ${productoFisico.stock} disponibles.`);
            }
        }

        const nuevoPedido = await Pedido.create(req.body);

        for (let item of productos) {
            await Producto.findByIdAndUpdate(item.productoId, {
                $inc: { stock: -item.cantidad } // Resta la cantidad
            });
        }
        res.format({
            json: () => res.status(201).json(nuevoPedido),
            html: () => res.redirect('/pedidos')
        });
    } catch (error) {
        res.format({
            json: () => res.status(400).json({ error: error.message }),
            html: () => res.status(400).send(`
                <article style="padding:2rem; text-align:center; color: red;">
                    <h2>Operación Denegada</h2>
                    <p>${error.message}</p>
                    <a href="/pedidos/nuevo" role="button">Volver al formulario</a>
                </article>
            `)
        });
    }
};

const updatePedido = async (req, res) => {
    try {
        const pedidoAntiguo = await Pedido.findById(req.params.id);
        if (!pedidoAntiguo) return res.status(404).json({ error: "Pedido no encontrado" });

        // Validar que el operario sea dueño de este pedido
        if (req.user.role !== 'admin' && pedidoAntiguo.franquiciaId.toString() !== req.user.franquiciaId.toString()) {
            return res.format({
                json: () => res.status(403).json({ error: "Acceso denegado a este pedido" }),
                html: () => res.status(403).send("Acceso denegado a este pedido")
            });
        }
        // Evitar que cambien el franquiciaId inyectando datos en req.body
        if (req.user.role !== 'admin') {
            req.body.franquiciaId = req.user.franquiciaId;
        }
        const nuevoEstado = req.body.estado;

        // Bloquear transiciones de estado inválidas para operarios
        if (req.user.role !== 'admin') {
            if (nuevoEstado && !['pendiente', 'cancelado'].includes(nuevoEstado)) {
                return res.format({
                    json: () => res.status(403).json({ error: "Operación inválida: Solo los administradores pueden pasar pedidos a 'En Proceso' o 'Completado'." }),
                    html: () => res.status(403).send("Operación inválida: Solo los administradores pueden pasar pedidos a 'En Proceso' o 'Completado'.")
                });
            }
        }

        if (pedidoAntiguo.estado !== 'cancelado' && nuevoEstado === 'cancelado') {
            for (let item of pedidoAntiguo.productos) {
                await Producto.findByIdAndUpdate(item.productoId, {
                    $inc: { stock: item.cantidad }
                }, { returnDocument: 'after' }); // Corrección de Warning de Mongoose
            }
        }

        if (pedidoAntiguo.estado === 'cancelado' && nuevoEstado !== 'cancelado') {
            for (let item of pedidoAntiguo.productos) {
                await Producto.findByIdAndUpdate(item.productoId, {
                    $inc: { stock: -item.cantidad }
                }, { returnDocument: 'after' });
            }
        }

        const updatedPedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.format({
            json: () => res.json(updatedPedido),
            html: () => res.redirect('/pedidos')
        });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};

const deletePedido = async (req, res) => {
    try {
        // Buscar primero para verificar propiedad antes de borrar
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
        if (req.user.role !== 'admin' && pedido.franquiciaId.toString() !== req.user.franquiciaId.toString()) {
            return res.format({
                json: () => res.status(403).json({ error: "Acceso denegado a este pedido" }),
                html: () => res.status(403).send("Acceso denegado a este pedido")
            });
        }
        await Pedido.findByIdAndDelete(req.params.id);

        res.format({
            json: () => res.status(204).send(),
            html: () => res.redirect('/pedidos')
        });
    } catch (error) {
        res.status(500).send("Error interno");
    }
};

module.exports = { getAllPedidos, getPedidoById, renderNewForm, renderEditForm, createPedido, updatePedido, deletePedido };
