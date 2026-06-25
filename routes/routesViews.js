const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { blockOperario } = require('../middleware/roleMiddleware');

// rutas de vistas de empleados:
router.get('/', blockOperario, employeeController.getAllEmployees);
router.get('/nuevo', blockOperario, employeeController.renderNewForm);
router.get('/:id/editar', blockOperario, employeeController.renderEditForm);

// La ruta dinámica /:id de empleados DEBE ir al final para no atrapar a /pedidos
router.get('/:id', blockOperario, employeeController.getEmployeeById);

module.exports = router;