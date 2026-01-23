const express = require('express');
const ruta = express.Router();
const validarObjectId = require('../middlewares/validarObjectId');
const validarCurso = require('../middlewares/validarCurso');
const { 
        obtenerCursoPorId,
        listarCursosActivos,
        crearCurso,
        actualizarCurso,
        desactivarCurso,
    } = require('../controller/cursoController');



ruta.get('/', listarCursosActivos);

ruta.get('/:id',validarObjectId('id'),obtenerCursoPorId);

ruta.post('/',validarCurso, crearCurso);

ruta.put('/:id', validarCurso, actualizarCurso);

ruta.delete('/:id', desactivarCurso);

module.exports = ruta;