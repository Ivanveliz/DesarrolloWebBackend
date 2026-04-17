const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Rutas GET para mostrar las pantallas web
router.get('/', employeeController.getAllEmployees);
router.get('/nuevo', employeeController.renderNewForm);
router.get('/:id/editar', employeeController.renderEditForm);


router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
