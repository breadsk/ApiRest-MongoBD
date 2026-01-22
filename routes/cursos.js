const express = require('express');
const ruta = express.Router();
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


ruta.get('/', (req, res) => {
    res.json('Listo el GET de cursos');
});

ruta.post('/', (req,res) => {
    let body = req.body;

    const { error, value } = schema.validate(
        {titulo: body.titulo, descripcion: body.descripcion});

    if(!error){
        let resultado = crearCurso(body);

        resultado.then(curso => {
            res.json({
                curso
            });
        }).catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
    }else{
        res.status(400).json({
            error: error.details[0].message
        });
    }
})

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

const crearCurso = async(body) => {

    let curso = new Curso({
        titulo: body.titulo,
        descripcion: body.descripcion       
    });    

    return await curso.save();
}

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

const existeCursoPorId = async(id) => {
    return Curso.findById(id);
}
module.exports = ruta;