#  Sistema de Gestión de Empleados - Panadería MVC

Este proyecto es el backend completo para la administración del personal de una panadería. Está construido utilizando **Node.js** y el framework **Express**, siguiendo un robusto patrón de diseño **MVC (Modelo-Vista-Controlador)**.

---

##  Tecnologías Principales
- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para crear el servidor web y enrutamiento ágil.
- **Pug**: Motor de plantillas elegido para compilar y generar dinámicamente HTML5 moderno sin escribir etiquetas complejas.
- **Method-Override**: Middleware vital que permite interceptar y utilizar métodos HTTP avanzados (`PUT`, `DELETE`) directamente desde peticiones HTML nativas (`<form>`).
- **Pico CSS**: Framework "Classless" vía CDN utilizado en las Vistas. Embellece e ilumina completamente las tablas, los botones y los formularios del CRUD, escribiendo exclusivamente etiquetas puras.

---

##  Arquitectura del Proyecto (MVC)
El servidor está desglosado lógicamente para mantener un código claro, limpio y preparado para escalar a equipos grandes.

```text
proyectoBackend/
├── index.js               <-- Archivo central (Orquestador de Express, middlewares y puerto)
├── bbdd.json              <-- Simulación de Base de Datos en un archivo local
├── package.json           <-- Archivo de configuración (Scripts y módulos instalados)
│
├── models/                <-- [M] MODELOS: Estructura de Programación Orientada a Objetos (POO)
│   ├── Person.js          <-- Clase base genérica humana (con el método `getFullName`)
│   └── Employee.js        <-- Clase laboral que hereda (`extends`) de Person
│
├── views/                 <-- [V] VISTAS: Pantallas interactivas compiladas (Pug)
│   ├── layout.pug         <-- Layout general (Cabecera, importación de fuentes, CSS maestro)
│   ├── index.pug          <-- Listado dinámico iterativo que arma la tabla de empleados
│   └── form.pug           <-- Formulario inteligente dual, adaptable para Crear o Editar
│
└── controllers/           <-- [C] CONTROLADORES: El Cerebro Lógico
│   └── employeeController.js <-- Contiene los métodos de manipulación de arrays y renderizado
│
└── routes/                <-- ENRUTADOR: Redirección del tráfico URL
    └── employeeRoutes.js  <-- Asocia endpoints `/nuevo`, `/editar` a funciones exclusivas
```

---

## 🛠 Modelado y Paradigma de Orientada a Objetos
El sistema subraya el uso de estructuras de herencia maduras en JS:
*   La superclase **`Person`** define los atributos globales y vitales como `Name`, `Surname` y `DNI`.
*   La subclase **`Employee`** extiende de ella invocando al `super()`, permitiéndole retener los atibutos humanos crudos pero acoplándoles detalles de vida empresarial como el `Role` y su `Shift` laboral respectivo.

---

## 🛣️ Rutas de la Aplicación y API
El entorno total discurre orgánicamente desde la raíz `/` implementada gracias al controlador `express.Router()`.

### Navegación Front-End (GET)
*   **`GET /`** $\Rightarrow$ Renderiza `views/index.pug`. Lista visualizando a todo el plantel actual proveniente de la BBDD.
*   **`GET /nuevo`** $\Rightarrow$ Renderiza `views/form.pug` en formato vacío (ideal para contrataciones nuevas).
*   **`GET /:id/editar`** $\Rightarrow$ Renderiza el `form.pug` pero inyectando automáticamente la pre-carga del historial actual del empleado filtrado por ID.

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
3. Visita tu entorno local web desde el navegador para accionar:
```text
http://localhost:3000/
```
