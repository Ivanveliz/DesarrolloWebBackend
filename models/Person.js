const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema({

  nombre: {
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

  rol: {
    type: String,
    enum: ["admin", "operario"],
    default: "operario"
  }

});

module.exports = mongoose.model("Persona", personaSchema);