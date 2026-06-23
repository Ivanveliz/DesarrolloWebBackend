const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { createPedido, getPedidoById, getAllPedidos } = require('../controllers/pedidoController');

// Middleware para bloquear acceso a vistas de edición/creación al rol operario
const blockOperario = (req, res, next) => {
    if (req.user && req.user.role === 'operario') {
        return res.status(403).send('Acceso denegado: Los operarios no pueden modificar la información.');
    }
    next();
};

// rutas de vistas de empleados:
router.get('/', employeeController.getAllEmployees);
router.get('/nuevo', blockOperario, employeeController.renderNewForm);
router.get('/:id/editar', blockOperario, employeeController.renderEditForm);
router.get('/:id', employeeController.getEmployeeById);

// Definimos las rutas de pedidos (ARRIBA de /:id para evitar que colisionen)
// router.get("/pedidos", getAllPedidos);          
// router.get('/pedidos/:id', getPedidoById);       
// router.post('/pedidos/crear', createPedido);     

// La ruta dinámica /:id de empleados DEBE ir al final para no atrapar a /pedidos
router.get('/:id', employeeController.getEmployeeById);

module.exports = router;