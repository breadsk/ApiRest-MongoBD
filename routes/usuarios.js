const express = require('express');
const ruta = express.Router();
const validarUsuario = require('../middlewares/validarUsuario');
const { listarUsuariosActivos , obtenerUsuarioPorEmail , guardarUsuario } = require('../controller/usuarioController');
const Usuario = require('../models/usuario_model');
const Joi = require('joi');


const schema = Joi.object({
    nombre: Joi.string()        
        .min(3)
        .max(10)
        .required(),
    
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});
    


ruta.get('/', listarUsuariosActivos);

ruta.get('/:email',obtenerUsuarioPorEmail);


ruta.post('/', validarUsuario , guardarUsuario);

ruta.put('/:email', (req, res) => {
    let email = req.params.email;

    const { error, value } = schema.validate({nombre: req.body.nombre});

    if(!error){
        let resultado = actualizarUsuario(email,req.body);
        resultado.then(valor => {
            res.json({
                valor
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

    
});

ruta.delete('/:email', async (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado.then(valor => {
        res.json({
            valor
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
});

const buscarUsuarioPorId = async(id) => {    
    return Usuario.findById(id);
}

const activarUsuario = async(email) => {
    let usuario = await Usuario.findOneAndUpdate({email},{
        $set: {
            estado: true
        }
    },{ new: true });
    return usuario;
}

const desactivarUsuario = async(email) => {
    let usuario = await Usuario.findOneAndUpdate({email},{
        $set: {
            estado: false
        }
    },{ new: true });
    return usuario;
}


const actualizarUsuario = async(email,body) => {

    let emailExiste = await existeEmail(email);

    if(!emailExiste){
        throw new Error('Email no registrado');
    }

    let usuario = await Usuario.findOneAndUpdate({email},{
        $set: {
            nombre: body.nombre,
            password: body.password
        }
    },{ new: true });
    return usuario;
}




const existeEmail = async(email) => {
    return Usuario.findOne({email: email});
}

module.exports = ruta;