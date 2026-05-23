require("dotenv").config();

const express = require("express");
const conectarDB = require("./config/db");
const methodOverride = require("method-override");
require("dotenv").config();
const rutasViewsFile = require("./routes/routesViews");

conectarDB();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
// Import de rutas
const employeeRoutes = require("./routes/employeeRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const loginRoutes = require("./routes/loginRoutes");
const franquiciaRoutes = require("./routes/franquiciaRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const loginController = require("./controllers/loginController");

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
app.use("/login", loginRoutes);
app.get('/logout', loginController.logout);
app.use("/franquicias", authMiddleware, franquiciaRoutes);
app.use("/", authMiddleware, rutasViewsFile);
app.use("/", authMiddleware, employeeRoutes);
app.use("/pedidos", authMiddleware, pedidoRoutes);

app.listen(PORT, function () {
    console.log("Servidor corriendo en http://localhost:" + PORT + "/");
    console.log("Modulo de pedidos activo en http://localhost:" + PORT + "/pedidos");
});