# Sistema de Gestión de Empleados - Panadería MVC

Este proyecto es el backend completo para la administración del personal y los pedidos de una panadería. Está construido utilizando **Node.js** y el framework **Express**, siguiendo un patrón de diseño MVC.

---

## Tecnologías Principales
- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para crear el servidor web y enrutamiento ágil.
- **Pug**: Motor de plantillas  para compilar y generar dinámicamente HTML.
- **Method-Override**: Middleware vital que permite interceptar y utilizar métodos HTTP avanzados (`PUT`, `DELETE`) directamente desde peticiones HTML nativas (`<form>`).
- **Pico CSS**: Framework "Classless" vía CDN utilizado en las Vistas. Mejora las vistas las tablas, los botones y los formularios del CRUD, escribiendo exclusivamente etiquetas puras.

---

## Arquitectura del Proyecto (MVC)

```text
proyectoBackend/
├── index.js               <-- Archivo central (Express, middlewares y puerto)
├── config/                <-- Archivos JSON simulando la Base de Datos (bbdd.json, pedidos.json)
├── package.json           <-- Archivo de configuración (Scripts y módulos instalados)
│
├── models/                <-- [M] MODELOS: Estructura de Programación Orientada a Objetos (POO)
│   ├── Person.js          <-- Clase base genérica humana (con el método `getFullName`)
│   ├── Employee.js        <-- Clase laboral que hereda (`extends`) de Person
│   └── Pedido.js          <-- Clase para gestionar las órdenes y persistencia de datos
│
├── views/                 <-- [V] VISTAS: Pantallas interactivas compiladas (Pug)
│   ├── layout.pug         <-- Layout general (Cabecera, importación de fuentes, CSS maestro)
│   ├── index.pug          <-- Listado dinámico iterativo que arma la tabla de empleados
│   ├── form.pug           <-- Formulario  adaptable para Crear o Editar
│   └── pedidos.pug        <-- Vista para visualizar el listado de pedidos
│
└── controllers/           <-- [C] CONTROLADORES: 
│   ├── employeeController.js <-- Métodos de empleados (renderizado HTML y respuestas JSON)
│   └── pedidoController.js   <-- Métodos para la gestión de productos y pedidos
│
└── routes/                <-- ENRUTADOR: Redirección del tráfico URL
    ├── employeeRoutes.js  <-- Rutas API (POST, PUT, DELETE) para empleados
    ├── pedidoRoutes.js    <-- Rutas API exclusivas para el módulo de pedidos
    └── routesViews.js     <-- Rutas globales destinadas a renderizar las vistas (GET)
```

---

##  Modelado y Paradigma de Orientada a Objetos
El sistema subraya el uso de estructuras de herencia:
*   La superclase **`Person`** define los atributos globales como `Name`, `Surname` y `DNI`.
*   La subclase **`Employee`** extiende de ella invocando al `super()`, permitiéndole retener los atibutos de base pero acoplándoles detalles empresariales como el `Role` y su `Shift` laboral respectivo.

---

## Rutas de la Aplicación y API
El entorno total arranca desde la raíz `/` implementada gracias al controlador `express.Router()`.

### Navegación Front-End (GET)
*   **`GET /`** $\Rightarrow$ Renderiza `views/index.pug`. Lista visualizando a todo el plantel actual proveniente de la BBDD.
*   **`GET /nuevo`** $\Rightarrow$ Renderiza `views/form.pug` en formato vacío (para cargar nuevos empleados).
*   **`GET /:id/editar`** $\Rightarrow$ Renderiza el `form.pug` pero inyectando automáticamente la pre-carga actual del empleado filtrado por ID.

### Transacciones CRUD (POST, PUT, DELETE)
*   **`POST /`** $\Rightarrow$ Genera matemáticamente un nuevo Id (previniendo bugs de superposición) y suma al empleado recién fichado redirigiendo automáticamente (`res.redirect`) de vuelta a `/`.
*   **`PUT /:id`** $\Rightarrow$ Modifica o reasigna turnos y roles a un empleado localizando su índice de base.
*   **`DELETE /:id`** $\Rightarrow$ Elimina de raíz al empleado de la nómina. Disparado por `<form action="?_method=DELETE">` desde el botón Borrar en pantalla gracias a Method Override.

---

##  Instalación y Uso (Desarrollo)
1. Estando situado en el entorno de la terminal, instala todos los módulos y librerías declarados:
```bash
npm install
```
2. Inicializa el servidor mediante script asociado (Hot-Reload de Nodemon habilitado para monitorear errores o reseteos):
```bash
npm run dev
```
3. Visita tu entorno local web desde el navegador para accionar: el puerto por defecto es 3000, puede ser otro si tenes .ENV configurado.
```text
http://localhost:3000/
```
