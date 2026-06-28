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
        required: true,
        unique: true
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
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    franquiciaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Franquicia",
        required: false // Lo dejamos en false por si el usuario 'admin' no pertenece a ninguna franquicia
    }
});

// Encriptar la contraseña antes de guardar el empleado
employeeSchema.pre("save", async function () {
    // Si la contraseña no se modificó, no hacemos nada
    if (!this.isModified("password")) {
        return;
    }

    // Si por algún motivo ya viene encriptada, no la volvemos a encriptar
    if (this.password && this.password.startsWith("$2")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    // Pisamos la contraseña en texto plano por el hash encriptado
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Employee", employeeSchema);