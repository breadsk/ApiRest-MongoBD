const express = require('express');
const ruta = express.Router();
const { login } = require('../controller/authController');


ruta.post('/', login);

module.exports = ruta;