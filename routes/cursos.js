const express = require('express');
const ruta = express.Router();
const validarObjectId = require('../middlewares/validarObjectId');
const validarCurso = require('../middlewares/validarCurso');
const validarToken = require('../middlewares/validarToken');
const { 
        obtenerCursoPorId,
        listarCursosActivos,
        crearCurso,
        actualizarCurso,
        desactivarCurso,
    } = require('../controller/cursoController');



ruta.get('/', validarToken,listarCursosActivos);

ruta.get('/:id',validarObjectId('id'),validarToken,obtenerCursoPorId);

ruta.post('/',validarToken,validarCurso, crearCurso);

ruta.put('/:id', validarToken,validarCurso, actualizarCurso);

ruta.delete('/:id', validarToken,desactivarCurso);

module.exports = ruta;