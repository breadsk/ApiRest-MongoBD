// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
//const config = require('config');

// Routers
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');


dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//Decodificar

//Conectar a la DB antes de iniciar el server
connectDB();

//Rutas
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});