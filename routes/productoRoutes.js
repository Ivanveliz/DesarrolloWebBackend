const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).send('Acceso denegado: Solo los administradores pueden modificar productos.');
    }
    next();
};

router.get('/', productoController.getAllProductos);
router.get('/nuevo', requireAdmin, productoController.renderNewForm);
router.get('/:id/editar', requireAdmin, productoController.renderEditForm);
router.get('/:id', productoController.getProductoById);

// Acciones de modificación protegidas con requireAdmin
router.post('/', requireAdmin, productoController.createProducto);
router.put('/:id', requireAdmin, productoController.updateProducto);
router.delete('/:id', requireAdmin, productoController.deleteProducto);

module.exports = router;
