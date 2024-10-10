const express = require('express');
const { getClientData, addClient, deleteClient, updateClient } = require('../controllers/clientController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Ruta para obtener todos los clientes (requiere autenticación)
router.get('/clients', verifyToken, getClientData);

// Ruta para agregar un nuevo cliente (requiere autenticación)
router.post('/clients', verifyToken, addClient);

// Ruta para eliminar un cliente por ID (requiere autenticación)
router.delete('/clients/:clientId', verifyToken, deleteClient);

// Ruta para actualizar un cliente por ID (requiere autenticación)
router.put('/clients/:clientId', verifyToken, updateClient);

module.exports = router;
