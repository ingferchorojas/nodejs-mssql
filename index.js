const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const cors = require('cors');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
    credentials: false, // No permitir credenciales (ajusta según tus necesidades)
};

// Usar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Conectar a la base de datos
connectDB();

// Rutas
app.use(userRoutes);
app.use(clientRoutes);
app.use(productRoutes);
app.use(orderRoutes);

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
