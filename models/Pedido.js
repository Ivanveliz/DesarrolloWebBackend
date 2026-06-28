const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    franquiciaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franquicia', // Relación estricta con Franquicia
        required: true
    },

    productos: [{
        productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto', // Relación estricta con Producto
            required: true
        },

        cantidad: {
            type: Number,
            required: true,
            min: 1
        }
    }],

    estado: {
        type: String,
        enum: ['pendiente', 'en proceso', 'completado', 'cancelado'],
        default: 'pendiente'
    },

    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);