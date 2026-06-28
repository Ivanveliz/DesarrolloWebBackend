# Sistema de Gestión de Panadería - Backend MVC

Proyecto backend para una panadería que administra empleados, franquicias, productos y pedidos con roles y autenticación.

---

## Tecnologías usadas
- Node.js
- Express 5
- MongoDB
- Mongoose
- Pug
- Socket.IO
- JWT
- bcrypt
- cookie-parser
- method-override
- Jest
- nodemon

---

## Qué hace el proyecto
- Login con email y contraseña
- Autenticación por JWT en cookie `jwt`
- Roles `admin` y `operario`
- CRUD de empleados
- CRUD de franquicias (solo admin)
- CRUD de productos (solo admin para crear/editar/borrar)
- Gestión de pedidos con stock y franquicia asociada
- Control de accesos según rol y franquicia
- Notificaciones de pedidos con Socket.IO
- Admin inicial creado automáticamente en MongoDB

---

## Estructura del proyecto
```text
DesarrolloWebBackend/
├── index.js
├── package.json
├── pnpm-lock.yaml
├── README.md
├── config/
│   ├── bbdd.json
│   ├── db.js
│   ├── employees.json
│   ├── pedidos.json
│   └── productos.json
├── controllers/
│   ├── employeeController.js
│   ├── franquiciaController.js
│   ├── loginController.js
│   ├── pedidoController.js
│   └── productoController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── Employee.js
│   ├── Franquicia.js
│   ├── Pedido.js
│   ├── Person.js
│   └── Producto.js
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── pedidosSocket.js
├── routes/
│   ├── employeeRoutes.js
│   ├── franquiciaRoutes.js
│   ├── loginRoutes.js
│   ├── pedidoRoutes.js
│   ├── productoRoutes.js
│   └── routesViews.js
├── tests/
│   ├── validarPedido.test.js
│   └── validarStock.test.js
├── utils/
│   ├── validarPedido.js
│   └── validarStock.js
└── views/
    ├── empleadoForm.pug
    ├── empleados.pug
    ├── franquiciaForm.pug
    ├── franquicias.pug
    ├── index.pug
    ├── inicio.pug
    ├── layout.pug
    ├── login.pug
    ├── pedidoDetalle.pug
    ├── pedidoForm.pug
    ├── pedidos.pug
    ├── productoForm.pug
    └── productos.pug
```

---

## Configuración
1. Instala dependencias:
```bash
pnpm install
```
2. Crea un archivo `.env` en la raíz con:
```env
MONGO_URI=mongodb://localhost:27017/tu_basedatos
JWT_SECRET=una_clave_secreta
PORT=3000
```
3. Inicia el servidor en modo desarrollo:
```bash
pnpm dev
```
4. Abre en el navegador:
```text
http://localhost:3000/
```

> Si no usas `pnpm`, puedes usar `npm install` y `npm run dev`, pero el proyecto está configurado con `pnpm`.

---

## Usuario admin automático
Al iniciar la app se crea automáticamente un admin si no existe:
- **email:** `admin@admin.com`
- **password:** `1234`
- **role:** `admin`

Esta lógica está en `config/db.js`. La contraseña se guarda hasheada con `bcrypt`.

---

## Autenticación y autorización
- El login crea un token JWT guardado en cookie `jwt`.
- `authMiddleware.js` valida el token y agrega `req.user` y `res.locals.user`.
- Las rutas protegidas requieren estar autenticado.
- Solo `admin` puede acceder a `/franquicias`.
- Solo `admin` puede crear, editar y borrar empleados y productos.
- Los `operarios` pueden listar/ver pedidos de su propia franquicia y crear pedidos.

---

## Cómo funciona la protección de rutas
- El middleware `authMiddleware.js` verifica que exista la cookie `jwt`.
- Si no hay token válido, redirige al login en HTML o responde 401 en JSON.
- Si el token es válido, decodifica el usuario y guarda los datos en `req.user`.
- `res.locals.user` se usa para mostrar información del usuario en las vistas.
- Las rutas de `/franquicias` solo permiten el rol `admin`.
- El resto de rutas protegidas solo se accede cuando hay sesión activa.

---

## Rutas principales
### Login
- `GET /login` → formulario de login
- `POST /login` → procesa el login
- `GET /logout` → cierra sesión

### Inicio
- `GET /` → pantalla principal protegida

### Empleados (`/empleados` - solo admin)
- `GET /empleados` → lista empleados
- `GET /empleados/nuevo` → formulario nuevo empleado
- `GET /empleados/:id/editar` → formulario de edición
- `POST /empleados` → crear empleado
- `PUT /empleados/:id` → actualizar empleado
- `DELETE /empleados/:id` → eliminar empleado

### Franquicias (`/franquicias` - solo admin)
- `GET /franquicias` → lista franquicias
- `GET /franquicias/nuevo` → formulario de franquicia
- `POST /franquicias` → crear franquicia
- `GET /franquicias/:id/editar` → editar franquicia
- `PUT /franquicias/:id` → actualizar franquicia
- `DELETE /franquicias/:id` → borrar franquicia

### Productos
- `GET /productos` → lista productos
- `GET /productos/nuevo` → formulario nuevo producto (admin)
- `GET /productos/:id/editar` → editar producto (admin)
- `GET /productos/:id` → ver producto
- `POST /productos` → crear producto (admin)
- `PUT /productos/:id` → actualizar producto (admin)
- `DELETE /productos/:id` → borrar producto (admin)

### Pedidos
- `GET /pedidos` → lista pedidos
- `GET /pedidos/nuevo` → formulario nuevo pedido
- `POST /pedidos` → crear pedido
- `GET /pedidos/:id/editar` → editar pedido
- `PUT /pedidos/:id` → actualizar pedido
- `PATCH /pedidos/:id` → actualizar pedido
- `DELETE /pedidos/:id` → eliminar pedido
- `GET /pedidos/:id` → detalle del pedido

---

## Componentes del proyecto
### `index.js`
- Conecta a MongoDB usando `config/db.js`.
- Configura Express, `cookie-parser`, `method-override`, `express.urlencoded` y rutas.
- Inicializa Socket.IO y lo deja disponible con `app.set('io', io)`.
- Define rutas públicas y protegidas.

### `config/db.js`
- Conecta a la base de datos MongoDB con `mongoose.connect`.
- Crea un usuario admin inicial si no existe.

### `controllers/loginController.js`
- Muestra el formulario de login.
- Verifica credenciales con `bcrypt`.
- Genera JWT y lo guarda en cookie.
- Limpia la cookie `jwt` en logout.

### `middleware/authMiddleware.js`
- Valida la cookie JWT en cada petición protegida.
- Agrega los datos del usuario a `req.user` y `res.locals.user`.
- Bloquea acceso a `/franquicias` si el usuario no es admin.

### `middleware/roleMiddleware.js`
- `requireAdmin` asegura que solo admins realicen ciertas acciones.
- `blockOperario` impide que operarios modifiquen datos restringidos.

### `models/Employee.js`
- Define el modelo `Employee` con contraseña hasheada.
- Incluye campos como `name`, `surname`, `dni`, `role`, `shift`, `email`, `password` y `franquiciaId`.

### `controllers/pedidoController.js`
- Gestiona creación, edición, listado y eliminación de pedidos.
- Filtra pedidos según la franquicia del usuario.
- Actualiza stock de productos y emite eventos por Socket.IO.

---

## Características destacadas
- `Employee` utiliza `bcrypt` para hashear contraseñas.
- `Pedido` conserva `productos` con `productoId` y `cantidad`.
- Se actualiza el stock de `Producto` cuando se crea o cancela un pedido.
- `Socket.IO` emite eventos de nuevo pedido, pedido actualizado y pedido eliminado.
- `authMiddleware` valida JWT y bloquea acceso no autorizado.
- `roleMiddleware` limita acciones de admin y operario.

---

## Notas
- El proyecto usa `JWT` y `bcrypt`; no se trata de una autenticación simple sin seguridad.
- Los datos completos de empleados se almacenan en MongoDB.
- La cookie `jwt` es `httpOnly` y expira en 24 horas.
- La app puede ejecutarse en `localhost:3000` por defecto.

---

## Resumen rápido
- Backend para administración de panadería
- Login con JWT y cookie segura
- Roles `admin` y `operario`
- CRUD de empleados, franquicias, productos y pedidos
- Filtrado de pedidos por franquicia
- Notificaciones en tiempo real con Socket.IO
- Tests con Jest disponibles en `tests/`
