const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado', data: {}, success: false });
    }

    jwt.verify(token, 'fox_app', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido', data: {}, success: false });
        }
        // Guardar la información del usuario decodificada en el request para su uso posterior
        req.user = decoded;
        next(); // Continuar al siguiente middleware o endpoint
    });
};

module.exports = verifyToken;
