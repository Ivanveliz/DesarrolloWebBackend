const express = require('express');
const router = express.Router();
const {
    getAllPedidos,
    getPedidoById,
    renderNewForm,
    renderEditForm,
    createPedido,
    updatePedido,
    deletePedido
} = require('../controllers/pedidoController');

router.get("/", getAllPedidos);
router.get("/nuevo", renderNewForm);
router.get('/:id/editar', renderEditForm);
router.get('/:id', getPedidoById);
router.post('/', createPedido);
router.put('/:id', updatePedido);
router.patch('/:id', updatePedido);
router.delete('/:id', deletePedido);

module.exports = router;
