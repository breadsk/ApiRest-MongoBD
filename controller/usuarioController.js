const Usuario = require('../models/usuario_model');
const bcrypt = require('bcrypt');



//En express , los controladores deben manejar
//los objetos req y res
const listarUsuariosActivos = async(req,res) => {

    try{

        let usuarios = await Usuario.find({estado: true})
        .select({nombre:1,email:1})
        res.json({
            success:true,
            valor:usuarios,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            error:'Error interno del servidor'
        });
    }
}

const obtenerUsuarioPorEmail = async(req,res) => {
    try{
        const { email } = req.params;

        const usuario = await Usuario.findOne({email:email});

        if(!usuario){
            return res.status(404).json({
                success:false,
                error: 'No existe un usuario con ese email'
            });
        }

         res.json({
            success: true,
            valor: {
                _id: usuario._id,
                email: usuario.email,
                nombre: usuario.nombre,
                estado: usuario.estado,
                imagen: usuario.imagen
                // No devolvemos la contraseña por seguridad
            }
        });


    }catch(error){
        res.status(500).json({
            success:false,
            error: 'Error interno del servidor'
        })
    }
}

const guardarUsuario = async(req,res) => {
    let body = req.body;

    try{
        let email = await existeEmail(body.email);

        if(email){
            res.status(409).json({
                success:false,
                error:'Ya hay un usuario con ese email'
            });
        }

        let usuario = new Usuario({
            email: body.email,
            nombre: body.nombre,
            password: bcrypt.hashSync( body.password, 10 )
        });

        const usuarioAdd =  await usuario.save();

        res.json({
            success:true,
            nombre: usuarioAdd.nombre,
            email: usuarioAdd.email
        });

    }catch(error) {
        res.status(500).json({
            success:false,
            error: 'Error interno del servidor'
        });
    }
}

const actualizarUsuario = async(req,res) => {
    try{

        let body = req.body;        
        let email = req.params.email;
        let usuarioExiste = await existeUsuario(email);

        if(!usuarioExiste){
            return res.status(404).json({
                success:false,
                error:'Usuario no existe para editar'
            });
        }

        let usuario = await Usuario.findOneAndUpdate({email},{
            $set:{
                nombre: body.nombre,
                password:body.password
            }
        },{ new:true });

        res.status(200).json({
            success:true,
            nombre: usuario.nombre,
            email: usuario.email,
        })

    }catch(error){
        res.status(500).json({
            success:false,
            error: 'error interno del servidor'
        });
    }
}

const desactivarUsuario = async(req,res) => {
    try{

        let email = req.params.email;

        let usuario = await Usuario.findOneAndUpdate({email},{
            $set: {
                estado:false
            }
        },{ new:true });

        return res.status(200).json({
            success:true,
            nombre: usuario.nombre,
            email:usuario.email
        });

    }catch(error){
        res.status(500).json({
            success:false,
            error: 'Error interno en el servidor'
        })
    }
}

async function existeEmail(email){
    return Usuario.findOne({email: email});
}

async function existeUsuario(email){
    return Usuario.findOne({email});
}

module.exports = {
    listarUsuariosActivos,
    obtenerUsuarioPorEmail,
    guardarUsuario,
    actualizarUsuario,
    desactivarUsuario,
}