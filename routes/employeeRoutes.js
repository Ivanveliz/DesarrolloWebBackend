const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Middleware para bloquear 
const blockOperario = (req, res, next) => {
    if (req.user && req.user.role === 'operario') {
        return res.status(403).send('Acceso denegado: Los operarios no pueden modificar la información.');
    }
    next();
};

router.post('/', blockOperario, employeeController.createEmployee);
router.put('/:id', blockOperario, employeeController.updateEmployee);
router.delete('/:id', blockOperario, employeeController.deleteEmployee);

module.exports = router;
