const mongoose = require('mongoose');

const franquiciaSchema = new mongoose.Schema({
    razonSocial: {
        type: String,
        required: true
    },

    cuit: {
        type: String,
        required: true,
        unique: true
    },

    direccion: {
        type: String,
        required: true
    },

    localidad: {
        type: String,
        required: true
    },

        correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Correo electrónico inválido.']
    },

    encargado: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Franquicia', franquiciaSchema);