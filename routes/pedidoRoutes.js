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

router.get('/', getAllPedidos);
router.get('/nuevo', renderNewForm);
router.post('/', createPedido);

router.get('/:id/editar', renderEditForm);
router.put('/:id', updatePedido);
router.patch('/:id', updatePedido);
router.delete('/:id', deletePedido);

router.get('/:id', getPedidoById);

module.exports = router;