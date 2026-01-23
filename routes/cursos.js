const express = require('express');
const ruta = express.Router();
const validarObjectId = require('../middlewares/validarObjectId');
const validarCurso = require('../middlewares/validarCurso');
const { 
        obtenerCursoPorId,
        listarCursosActivos,
        crearCurso,
    } = require('../controller/cursoController');
const Curso = require('../models/curso_model');
const Joi = require('joi');

const schema = Joi.object({
    titulo: Joi.string()        
        .min(10)
        .max(100)
        .required(),
    descripcion: Joi.string()
        .min(30)
        .max(400)
        .required(),    
});


ruta.get('/', listarCursosActivos);

ruta.get('/:id',validarObjectId('id'),obtenerCursoPorId);

ruta.post('/',validarCurso, crearCurso);

ruta.put('/:id', (req, res) => {
    let id = req.params.id;

    const { error, value } = schema.validate(
        {titulo: req.body.titulo, descripcion: req.body.descripcion});

    if(!error){
        let resultado = actualizarCurso(id,req.body);
        resultado.then( curso => {
            res.json({
                curso
            });
        }).catch( err => {
            res.status(400).json({
                error: err.message
            });
        });
    }else{
        res.status(400).json({
            error: error.details[0].message
        });
    } 
});

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

const actualizarCurso = async(id,body) => {
    let cursoExiste = await existeCursoPorId(id);
    if(!cursoExiste){
        throw new Error('No existe un curso con ese ID');
    }

    let curso = await Curso.findOneAndUpdate({_id:id},{
        $set: {
            titulo: body.titulo,
            descripcion: body.descripcion
        }
    },{new: true});
    return curso;
}

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