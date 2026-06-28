const Producto = require('../models/Producto');

const getAllProductos = async (req, res) => {
    try {
        const productos = await Producto.find();

        res.format({
            json: () => res.json(productos),
            html: () => res.render("productos", { productos })
        });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(producto);

    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
};

const renderNewForm = (req, res) => {
    res.render("productoForm", { isEdit: false, producto: null });
};

const renderEditForm = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("productoForm", { isEdit: true, producto });

    } catch (error) {
        res.status(500).send("Error al cargar formulario");
    }
};

const createProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);

        res.format({
            json: () => res.status(201).json(nuevoProducto),
            html: () => res.redirect('/productos')
        });

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
};

const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        res.format({
            json: () => res.json(producto),
            html: () => res.redirect('/productos')
        });

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
};

const deleteProducto = async (req, res) => {
    try {
        const deleted = await Producto.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).send("Producto no encontrado");
        }

        res.format({
            json: () => res.status(204).send(),
            html: () => res.redirect('/productos')
        });

    } catch (error) {
        res.status(500).send("Error interno");
    }
};

module.exports = {
    getAllProductos,
    getProductoById,
    renderNewForm,
    renderEditForm,
    createProducto,
    updateProducto,
    deleteProducto
};