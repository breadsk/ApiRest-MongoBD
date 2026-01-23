const express = require('express');
const ruta = express.Router();
const validarObjectId = require('../middlewares/validarObjectId');
const validarCurso = require('../middlewares/validarCurso');
const { 
        obtenerCursoPorId,
        listarCursosActivos,
        crearCurso,
        actualizarCurso
    } = require('../controller/cursoController');
const Curso = require('../models/curso_model');


ruta.get('/', listarCursosActivos);

ruta.get('/:id',validarObjectId('id'),obtenerCursoPorId);

ruta.post('/',validarCurso, crearCurso);

ruta.put('/:id', validarCurso, actualizarCurso);

ruta.delete('/:id', (req, res) => {
    let resultado = desactivarCurso(req.params.id);
    resultado.then( curso => {
        res.json({
            curso
        });
    }).catch( err => {
        res.status(400).json({
            error: err.message
        });
    });
});


const desactivarCurso = async(id) => {
    let curso = await Curso.findOneAndUpdate({_id:id},{
        $set: {
            estado: false
        }
    },{ new:true });
    return curso;
}

async function existeCursoPorId(id) {
    return Curso.findById(id);
}
module.exports = ruta;