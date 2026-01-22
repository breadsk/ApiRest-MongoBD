const express = require('express');
const ruta = express.Router();
const Curso = require('../models/curso_model');
const Joi = require('joi');

ruta.get('/', (req, res) => {
    res.json('Listo el GET de cursos');
});

module.exports = ruta;