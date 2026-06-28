require("dotenv").config();

const express = require("express");
const conectarDB = require("./config/db");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const http = require("http");
const { Server } = require("socket.io");

// Import de rutas
const employeeRoutes = require("./routes/employeeRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const productoRoutes = require("./routes/productoRoutes");
const loginRoutes = require("./routes/loginRoutes");
const franquiciaRoutes = require("./routes/franquiciaRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const loginController = require("./controllers/loginController");

conectarDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Guarda Socket.IO dentro de Express para poder usarlo después en el controller de pedidos
app.set("io", io);

// Archivos estáticos
app.use(express.static("public"));

// Motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", "./views");

// --- Middlewares ---
app.use(express.json());

// Middleware para procesar datos de formularios Pug
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear las cookies automáticamente
app.use(cookieParser());

// Esto es porque si no no anda el DELETE y PUT desde formularios Pug
app.use(methodOverride("_method"));

// --- Rutas públicas ---
app.use("/login", loginRoutes);
app.get("/logout", loginController.logout);

// --- Rutas protegidas ---
app.get("/", authMiddleware, (req, res) => res.render("inicio"));

app.use("/franquicias", authMiddleware, franquiciaRoutes);
app.use("/pedidos", authMiddleware, pedidoRoutes);
app.use("/productos", authMiddleware, productoRoutes);
app.use("/empleados", authMiddleware, employeeRoutes);

// Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado por Socket.IO:", socket.id);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Módulo de pedidos activo en http://localhost:${PORT}/pedidos`);
});