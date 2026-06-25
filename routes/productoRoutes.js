const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/', productoController.getAllProductos);
router.post('/', requireAdmin, productoController.createProducto);

router.get('/nuevo', requireAdmin, productoController.renderNewForm);
router.get('/:id/editar', requireAdmin, productoController.renderEditForm);
router.get('/:id', productoController.getProductoById);

router.put('/:id', requireAdmin, productoController.updateProducto);
router.delete('/:id', requireAdmin, productoController.deleteProducto);

module.exports = router;
