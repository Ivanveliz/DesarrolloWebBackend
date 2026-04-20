const express = require("express");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Import de rutas
const employeeRoutes = require("./routes/employeeRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

// motor de plantillas (Pug)
app.set("view engine", "pug");
app.set("views", "./views");

// --- Middlewares ---
app.use(express.json());
// middleware para procesar datos de formularios (Pug)
app.use(express.urlencoded({ extended: true }));
// Esto es porque si no no anda el delete (necesario para formularios Pug)
app.use(methodOverride("_method"));

// --- Rutas ---
app.use("/", employeeRoutes);
app.use("/pedidos", pedidoRoutes);

app.listen(PORT, function() {
    console.log("Servidor corriendo en http://localhost:" + PORT + "/");
    console.log("Modulo de pedidos activo en http://localhost:" + PORT + "/pedidos");
});