const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    dni: {
        type: Number,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    shift: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    franquiciaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franquicia',
        required: false // Lo dejamos en false por si el usuario 'admin' no pertenece a ninguna franquicia
    }

});

// Encriptar la contraseña antes de guardar el empleado
employeeSchema.pre('save', async function () {
    // Si la contraseña no es nueva ni se modificó, cortamos acá
    if (!this.isModified('password')) return;

    // Pisamos la contraseña en texto plano por el hash encriptado
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("Employee", employeeSchema);