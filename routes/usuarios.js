const express = require('express');
const ruta = express.Router();
const validarUsuario = require('../middlewares/validarUsuario');
const { 
        listarUsuariosActivos , 
        obtenerUsuarioPorEmail , 
        guardarUsuario , 
        actualizarUsuario ,
        desactivarUsuario } = require('../controller/usuarioController');

    
ruta.get('/', listarUsuariosActivos);

ruta.get('/:email',obtenerUsuarioPorEmail);

ruta.post('/', validarUsuario , guardarUsuario);

ruta.put('/:email',validarUsuario , actualizarUsuario);

ruta.delete('/:email', desactivarUsuario);


module.exports = ruta;