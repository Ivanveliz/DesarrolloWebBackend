const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Todo el módulo de empleados queda solo para administradores
router.use(requireAdmin);

// rutas de vistas de empleados:
router.get('/', employeeController.getAllEmployees);
router.get('/nuevo', employeeController.renderNewForm);
router.get('/:id/editar', employeeController.renderEditForm);

// La ruta dinámica /:id de empleados DEBE ir al final para no atrapar a /pedidos
router.get('/:id', employeeController.getEmployeeById);

module.exports = router;