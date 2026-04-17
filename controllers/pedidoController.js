const Pedido = require('../models/Pedido');

// READ ALL
const getAllPedidos = (req, res) => {
    try {
        const pedidos = Pedido.getAll();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// READ ONE
const getPedidoById = (req, res) => {
    try {
        const pedido = Pedido.getById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// CREATE
const createPedido = (req, res) => {
    try {
        const { franquiciaId, productos } = req.body;

        if (!franquiciaId || !productos || productos.length === 0) {
            return res.status(400).json({ error: "franquiciaId and products are required" });
        }

        const newPedido = new Pedido(franquiciaId, productos);
        const savedPedido = newPedido.create();

        res.status(201).json(savedPedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE (Sirve para PUT y PATCH)
const updatePedido = (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedPedido = Pedido.update(id, updatedData);

        if (!updatedPedido) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(updatedPedido);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE
const deletePedido = (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = Pedido.delete(id);

        if (!isDeleted) {
            return res.status(404).json({ error: "Order not found" });
        }

        // 204 No Content significa que se borró con éxito y no hay datos que devolver
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    deletePedido
};