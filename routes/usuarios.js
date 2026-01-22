const express = require('express');
const ruta = express.Router();
const Usuario = require('../models/usuario_model');

ruta.get('/', (req, res) => {
    res.json('Listo el GET de usuarios');
});

ruta.post('/', (req,res) => {
    let body = req.body;
    let resultado = crearUsuario(body);

    resultado.then( user => {
        res.json({
            valor: user
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });
});

ruta.put('/:email', (req, res) => {
    let email = req.params.email;    
    let resultado = actualizarUsuario(email,req.body);
    resultado.then(valor => {
        res.json({
            valor
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    })
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
    let usuario = await Usuario.findOneAndUpdate({email},{
        $set: {
            nombre: body.nombre,
            password: body.password
        }
    },{ new: true });
    return usuario;
}


const crearUsuario = async(body) => {
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: body.password
    });
    return await usuario.save();
};

module.exports = ruta;