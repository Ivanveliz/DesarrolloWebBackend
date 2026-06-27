const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const employeeRoutes = require('./employeeRoutes');


// rutas de vistas:
router.get('/', employeeController.getAllEmployees);
router.get('/nuevo', employeeController.renderNewForm);
router.get('/:id/editar', employeeController.renderEditForm);

// La ruta dinámica /:id de empleados DEBE ir al final
router.get('/:id', employeeController.getEmployeeById);

// Rutas de acción de empleados (crear, actualizar, eliminar)
router.use('/', employeeRoutes);

module.exports = router;