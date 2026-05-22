const express = require('express');
const router = express.Router();
const franquiciaController = require('../controllers/franquiciaController');

router.get('/', franquiciaController.getAllFranquicias);
router.get('/nuevo', franquiciaController.renderNewForm);
router.post('/', franquiciaController.createFranquicia);
router.get('/:id/editar', franquiciaController.renderEditForm);
router.put('/:id', franquiciaController.updateFranquicia);
router.delete('/:id', franquiciaController.deleteFranquicia);

module.exports = router;
