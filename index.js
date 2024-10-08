const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.use(cors());

// Conectar a la base de datos
connectDB();

// Rutas
app.use(userRoutes);

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
