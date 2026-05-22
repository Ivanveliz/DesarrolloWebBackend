# Sistema de Gestión de Empleados - Panadería MVC

Proyecto de backend para la administración de empleados, login y franquicias de una panadería.

---

## Tecnologías usadas
- Node.js
- Express
- MongoDB
- Mongoose
- Pug
- method-override
- Pico CSS (vía CDN)

---

## Qué hace el proyecto
- Login simple con MongoDB
- Autenticación por cookie
- Logout
- CRUD de empleados
- Módulo de franquicias protegido para admin
- Vistas con Pug
- Rutas protegidas con middleware
- Admin inicial creado automáticamente en MongoDB

---

## Estructura del proyecto
```text
DesarrolloWebBackend/
├── index.js
├── package.json
├── README.md
├── config/
│   └── db.js
├── controllers/
│   ├── employeeController.js
│   └── loginController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Employee.js
│   └── Franquicia.js
├── routes/
│   ├── employeeRoutes.js
│   ├── franquiciaRoutes.js
│   ├── loginRoutes.js
│   └── routesViews.js
├── views/
│   ├── layout.pug
│   ├── login.pug
│   ├── index.pug
│   ├── form.pug
│   ├── franquicias.pug
│   └── franquiciaForm.pug
└── public/
    └── css/
        └── styles.css
```

---

## Cómo iniciar el proyecto
1. Instala dependencias:
```bash
npm install
```
2. Crea archivo `.env` con tu conexión a MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/tu_basedatos
```
3. Inicia el servidor:
```bash
npm run dev
```
4. Abre en el navegador:
```text
http://localhost:3000/
```

---

## Usuario admin automático
Al iniciar la app se crea automáticamente este usuario si no existe en la base:
- **email:** `admin@admin.com`
- **password:** `1234`
- **role:** `admin`

Esto se hace en `config/db.js`.

---

## Cómo funciona el login
- `GET /login` muestra la pantalla de login separada.
- `POST /login` busca en MongoDB un empleado con el `email` y `password` ingresados.
- Si no existe, muestra error en la misma vista.
- Si existe, guarda una cookie `user` y redirige al panel principal (`/`).
- `GET /logout` borra la cookie y vuelve a `/login`.

---

## Rutas principales
### Login
- `GET /login` → muestra formulario de login
- `POST /login` → procesa el login
- `GET /logout` → cierra sesión

### Empleados
- `GET /` → lista empleados
- `GET /nuevo` → formulario nuevo empleado
- `GET /:id/editar` → formulario edición
- `POST /` → crear empleado
- `PUT /:id` → actualizar empleado
- `DELETE /:id` → eliminar empleado

### Franquicias
- `GET /franquicias` → lista franquicias (solo admin)
- `GET /franquicias/nuevo` → nuevo registro (solo admin)
- `POST /franquicias` → crear franquicia (solo admin)
- `GET /franquicias/:id/editar` → editar franquicia (solo admin)
- `PUT /franquicias/:id` → actualizar franquicia (solo admin)
- `DELETE /franquicias/:id` → borrar franquicia (solo admin)

### Pedidos
- `GET /pedidos` → lista pedidos
- `GET /pedidos/:id` → detalle pedido
- `POST /pedidos/crear` → crear pedido

---

## Cómo funciona la protección de rutas
- `authMiddleware.js` revisa la cookie `user`.
- Si no hay cookie, redirige a `/login`.
- Si existe cookie, deja pasar.
- Si la ruta es `/franquicias` y el rol no es `admin`, devuelve error 403.

---

## Componentes del proyecto
### `index.js`
- conecta la base de datos
- configura Express
- aplica `method-override`
- carga rutas y middleware

### `config/db.js`
- conecta a MongoDB con `mongoose.connect`
- crea el admin inicial si no existe

### `controllers/loginController.js`
- maneja mostrar login, procesar login y logout

### `middleware/authMiddleware.js`
- protege rutas con cookie `user`
- controla acceso admin para franquicias

### `models/Employee.js`
- define el modelo de empleado en MongoDB
- contiene campos: `name`, `surname`, `dni`, `role`, `shift`, `email`, `password`

### `views/login.pug`
- vista de login separada
- no extiende `layout.pug`

### `views/layout.pug`
- layout del sistema principal con navbar
- muestra botón `Cerrar sesión`

### `views/index.pug`
- lista empleados
- muestra números simples `1, 2, 3...` en vez de `_id` largos

---

## Notas importantes
- El login es simple y no usa JWT ni bcrypt.
- La sesión se guarda con una cookie básica.
- El navbar y el sistema solo se ven si el usuario está autenticado.
- El CRUD sigue funcionando igual.

---

## Resumen rápido
- Login con MongoDB
- Autenticación por cookie
- Logout
- CRUD de empleados
- Módulo de franquicias para admin
- Vistas en Pug
- Rutas protegidas con middleware

¡Listo! Ahora tu README refleja el estado actual del proyecto.