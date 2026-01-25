const express = require('express');
const ruta = express.Router();
const validarUsuario = require('../middlewares/validarUsuario');
const validarToken = require('../middlewares/validarToken');
const { 
        listarUsuariosActivos , 
        obtenerUsuarioPorEmail , 
        guardarUsuario , 
        actualizarUsuario ,
        desactivarUsuario } = require('../controller/usuarioController');

    
ruta.get('/',validarToken, listarUsuariosActivos);

ruta.get('/:email',validarToken,obtenerUsuarioPorEmail);

ruta.post('/', validarToken,validarUsuario , guardarUsuario);

ruta.put('/:email',validarToken,validarUsuario , actualizarUsuario);

ruta.delete('/:email', validarToken,desactivarUsuario);


module.exports = ruta;