const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { blockOperario } = require('../middleware/roleMiddleware');

router.use(blockOperario);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
