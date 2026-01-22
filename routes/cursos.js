const express = require('express');
const mongoose = require('mongoose');
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
    let cursos = listarCursosActivos();
    cursos.then( lista => {
        res.json({
            valor: lista
        });
    }).catch( err => {
        res.status(400).json({
            error: err.message
        });
    });
});

ruta.get('/:id', async(req,res) => {

    const id = req.params.id;

    try{
        //1 Validar formato del ID
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                error: `ID ${id} no tiene formato válido. Debe ser un ObjectId de 24 caracteres hexadecimales`
            })
        }

        //2.Buscar el curso
        const curso = await Curso.findById(id);

        //3. Verrificar si existe
        if(!curso){
            return res.status(404).json({
                success: false,
                error: 'No existe un curso con ese ID'
            });
        }

        //4. Si existe mostrarlo
        res.json({
            success:true,
            valor:curso
        });


    } catch(err) {
        res.status(500).json({
            success:false,
            error: 'Error interno del servidor'
        })
    }
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

const buscarCursoPorId = async(id) => {

    let existeCurso = await existeCursoPorId(id);
    if(!existeCurso){
        throw new Error('No existe un curso con ese ID');
    }

    return Curso.findById(id);
}

const listarCursosActivos = async() => {
    let cursos = await Curso.find({estado:true});
    return cursos;
}

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