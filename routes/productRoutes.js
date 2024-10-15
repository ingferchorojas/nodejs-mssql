const express = require('express');
const { getProductData, addProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Ruta para obtener todos los productos (requiere autenticación)
router.get('/products', verifyToken, getProductData);

// Ruta para agregar un nuevo producto (requiere autenticación)
router.post('/products', verifyToken, addProduct);

// Ruta para eliminar un producto por ID (requiere autenticación)
router.delete('/products/:productId', verifyToken, deleteProduct);

// Ruta para actualizar un producto por ID (requiere autenticación)
router.put('/products/:productId', verifyToken, updateProduct);

module.exports = router;
