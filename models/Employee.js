const mongoose = require("mongoose");

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
    }

});

module.exports = mongoose.model("Employee", employeeSchema);