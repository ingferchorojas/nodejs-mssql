const express = require('express');
const { getOrderData, addOrder, deleteOrder, updateOrder } = require('../controllers/orderController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Ruta para obtener todas las órdenes del usuario autenticado
router.get('/orders', verifyToken, getOrderData);

// Ruta para agregar una nueva orden
router.post('/orders', verifyToken, addOrder);

// Ruta para actualizar una orden existente
router.put('/orders/:orderId', verifyToken, updateOrder);

// Ruta para marcar una orden como eliminada
router.delete('/orders/:orderId', verifyToken, deleteOrder);

module.exports = router;
