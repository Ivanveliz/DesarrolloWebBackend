require("dotenv").config();

const express = require("express");
const conectarDB = require("./config/db");
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const rutasViewsFile = require("./routes/routesViews");

conectarDB();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
// Import de rutas
const employeeRoutes = require("./routes/employeeRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const productoRoutes = require("./routes/productoRoutes");
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
app.use(cookieParser());
// Middleware para parsear las cookies automáticamente
app.use(methodOverride("_method"));

// Configurar express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu-secreto-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// --- Rutas ---
app.use("/login", loginRoutes);
app.get('/logout', loginController.logout);

app.use("/franquicias", authMiddleware, franquiciaRoutes);
app.use("/pedidos", authMiddleware, pedidoRoutes);
app.use("/productos", authMiddleware, productoRoutes);

app.get("/", authMiddleware, (req, res) => res.render("inicio"));
app.use("/empleados", authMiddleware, rutasViewsFile);
app.use("/empleados", authMiddleware, employeeRoutes);





app.set("io", io); //guarda Socket.IO dentro de Express para poder usarlo después en el controller de pedidos

io.on("connection", (socket) => {
  console.log("Usuario conectado por Socket.IO:", socket.id);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
