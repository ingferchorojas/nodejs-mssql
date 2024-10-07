const { sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken

const createUser = async (req, res) => {
    const { password, first_name, last_name, document_number } = req.body;

    if (!password || !first_name || !last_name || !document_number) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Hash la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await sql.query`
            INSERT INTO app_users (password, first_name, last_name, document_number, created_at, updated_at)
            VALUES (${hashedPassword}, ${first_name}, ${last_name}, ${document_number}, GETDATE(), GETDATE());
        `;
        res.status(201).json({ message: 'Usuario creado correctamente', data: {}, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando usuario', data: {}, success: false });
    }
};

const loginUser = async (req, res) => {
    const { document_number, password } = req.body;

    if (!document_number || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Buscar el usuario por el número de documento
        const result = await sql.query`
            SELECT password, first_name, last_name, document_number FROM app_users WHERE document_number = ${document_number};
        `;

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado', success: false });
        }

        const user = result.recordset[0];

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta', success: false });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { document_number: user.document_number, first_name: user.first_name, last_name: user.first_name },
            'fox_app',
            { expiresIn: '10000000h' }
        );

        res.status(200).json({ message: 'Login exitoso', data: token, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el login', data: {}, success: false });
    }
};

const getUserData = async (req, res) => {
    try {
        const document_number = req.user.document_number; // Obtener el número de documento del token

        // Buscar el usuario en la base de datos usando el número de documento
        const result = await sql.query`
            SELECT first_name, last_name, document_number FROM app_users WHERE document_number = ${document_number};
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado', success: false });
        }

        const user = result.recordset[0];
        res.status(200).json({ message: 'Datos del usuario obtenidos correctamente', data: user, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener datos del usuario', data: {}, success: false });
    }
};

module.exports = {
    createUser,
    loginUser,
	getUserData
};
