const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { createPedido, getPedidoById, getAllPedidos } = require('../controllers/pedidoController');


// rutas de vistas:
router.get('/', employeeController.getAllEmployees);
router.get('/nuevo', employeeController.renderNewForm);
router.get('/:id/editar', employeeController.renderEditForm);

// Definimos las rutas de pedidos (ARRIBA de /:id para evitar que colisionen)
router.get("/pedidos", getAllPedidos);          
router.get('/pedidos/:id', getPedidoById);       
router.post('/pedidos/crear', createPedido);     

// La ruta dinámica /:id de empleados DEBE ir al final para no atrapar a /pedidos
router.get('/:id', employeeController.getEmployeeById);

module.exports = router;