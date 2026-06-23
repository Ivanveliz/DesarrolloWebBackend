const Pedido = require('../models/Pedido');
const Franquicia = require('../models/Franquicia');
const Producto = require('../models/Producto');

const getAllPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('franquiciaId');
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
        const franquicias = await Franquicia.find();
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

        const franquicias = await Franquicia.find();
        const productos = await Producto.find();
        res.render("pedidoForm", { isEdit: true, pedido, franquicias, productos });
    } catch (error) {
        res.status(500).send("Error al cargar formulario de edición");
    }
};

const createPedido = async (req, res) => {
    try {
        const { franquiciaId, productos } = req.body;
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
        const nuevoEstado = req.body.estado;
        // Si se CANCELA el pedido, devolvemos el stock
        if (pedidoAntiguo.estado !== 'cancelado' && nuevoEstado === 'cancelado') {
            for (let item of pedidoAntiguo.productos) {
                await Producto.findByIdAndUpdate(item.productoId, {
                    $inc: { stock: item.cantidad } // Suma la cantidad de vuelta
                });
            }
        }
        // INTELIGENCIA DE NEGOCIO: Si estaba cancelado (stock devuelto) y lo reviven, lo volvemos a descontar
        if (pedidoAntiguo.estado === 'cancelado' && nuevoEstado !== 'cancelado') {
            for (let item of pedidoAntiguo.productos) {
                await Producto.findByIdAndUpdate(item.productoId, {
                    $inc: { stock: -item.cantidad }
                });
            }
        }
        const updatedPedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
        const isDeleted = await Pedido.findByIdAndDelete(req.params.id);
        if (!isDeleted) return res.status(404).json({ error: "Pedido no encontrado" });
        res.format({
            json: () => res.status(204).send(),
            html: () => res.redirect('/pedidos')
        });
    } catch (error) {
        res.status(500).send("Error interno");
    }
};

module.exports = { getAllPedidos, getPedidoById, renderNewForm, renderEditForm, createPedido, updatePedido, deletePedido };
