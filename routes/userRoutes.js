const express = require('express');
const { createUser, loginUser, getUserData, changePassword } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/users', createUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta protegida para obtener los datos del usuario
router.get('/user', verifyToken, getUserData);

// Ruta para cambiar la contraseña
router.post('/change-password', verifyToken, changePassword);

module.exports = router;
