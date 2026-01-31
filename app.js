const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');

// Solo cargar dotenv en desarrollo
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Routers
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');

const app = express();

// Configuración CORS
const corsOptions = {
  origin: 'http://localhost:5173', // <- Frontend URL
  credentials: true, // ¡ESTO ES CRUCIAL!
};

// Middlewares
app.use(cors(corsOptions)); // <- ¡CORS primero!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Conectar a la DB antes de iniciar el server
connectDB();

//Rutas
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

const port = process.env.PORT || 5000; // Cambié a 5000 para coincidir con tu frontend

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});