const express = require('express');
const router = express.Router();

const { 
    getAllPedidos, 
    getPedidoById, 
    createPedido, 
    updatePedido, 
    deletePedido 
} = require('../controllers/pedidoController');

// Definimos las rutas y las enlazamos con su respectivo controlador
router.get("/pedidos", getAllPedidos);          
router.get('/:id', getPedidoById);       
router.post('/', createPedido);          

// endpoints backend
router.put('/:id', updatePedido);         // Actualización completa
router.patch('/:id', updatePedido);       // Actualización parcial estricta
router.delete('/:id', deletePedido);      

module.exports = router;