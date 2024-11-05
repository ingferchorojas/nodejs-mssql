const { sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken

const createUser = async (req, res) => {
    const { username, password, first_name, last_name, phone } = req.body;
    console.log(req.body)
    if (!username || !password || !first_name || !last_name || !phone) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Hash la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Datos de inserción
        const signupData = { 
            username: username.trim(), 
            password: hashedPassword, 
            first_name: first_name.trim(), 
            last_name: last_name.trim(), 
            phone: phone.trim() 
        };

        const result = await sql.query`
            INSERT INTO app_users (username, password, first_name, last_name, phone, created_at, updated_at)
            VALUES (${signupData.username}, ${signupData.password}, ${signupData.first_name}, ${signupData.last_name}, ${signupData.phone}, GETDATE(), GETDATE());
        `;
        
        res.status(201).json({ message: 'Usuario creado correctamente', data: {}, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando usuario', data: {}, success: false });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Buscar el usuario por el nombre de usuario
        const result = await sql.query`
            SELECT * FROM app_users WHERE username = ${username};
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
            { id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name },
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
        const id = req.user.id; // Obtener el número de documento del token

        // Buscar el usuario en la base de datos usando el número de documento
        const result = await sql.query`
            SELECT * FROM app_users WHERE id = ${id};
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

const changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Buscar el usuario por su username
        const result = await sql.query`
            SELECT password FROM app_users WHERE username = ${username};
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];

        // Verificar la contraseña actual
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Hash de la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await sql.query`
            UPDATE app_users 
            SET password = ${hashedNewPassword}, updated_at = GETDATE() 
            WHERE username = ${username};
        `;

        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cambiando la contraseña' });
    }
};

module.exports = {
    createUser,
    loginUser,
	getUserData,
    changePassword
};
