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

const crearCurso = async(body) => {

    let curso = new Curso({
        titulo: body.titulo,
        descripcion: body.descripcion       
    });    

    return await curso.save();
}

module.exports = ruta;